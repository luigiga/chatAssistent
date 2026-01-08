/**
 * Use Case: Buscar memórias por texto
 */
import { Injectable, Inject } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { SearchMemoriesDto } from '../../dto/search-memories.dto';
import {
  TASK_REPOSITORY,
  NOTE_REPOSITORY,
  REMINDER_REPOSITORY,
  CATEGORY_REPOSITORY,
} from '@infrastructure/auth/tokens';

export interface NormalizedSearchResult {
  id: string;
  type: 'task' | 'note' | 'reminder';
  title: string;
  snippet: string;
  createdAt: string;
  when?: string;
  category?: { id: string; name: string; color: string } | null;
}

@Injectable()
export class SearchMemoriesUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string, dto: SearchMemoriesDto): Promise<NormalizedSearchResult[]> {
    const searchTerm = dto.q.toLowerCase();
    const results: NormalizedSearchResult[] = [];

    // Determinar tipos a buscar
    const typesToSearch = dto.types && dto.types.length > 0 
      ? dto.types 
      : ['task', 'note', 'reminder'];

    // Buscar todas as categorias do usuário para mapear IDs
    const allCategories = await this.categoryRepository.findByUserId(userId);
    const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));

    // Buscar tasks
    if (typesToSearch.includes('task')) {
      const tasks = await this.taskRepository.findByUserId(userId);
      for (const task of tasks) {
        // Filtrar por categoria
        if (dto.categoryIds && dto.categoryIds.length > 0) {
          const taskCategoryId = (task as any).categoryId;
          if (!taskCategoryId || !dto.categoryIds.includes(taskCategoryId)) {
            continue;
          }
        }

        // Filtrar por status
        if (dto.status === 'done' && !task.completed) continue;
        if (dto.status === 'open' && task.completed) continue;

        // Filtrar por data
        if (dto.from && task.createdAt < new Date(dto.from)) continue;
        if (dto.to && task.createdAt > new Date(dto.to)) continue;

        const titleMatch = task.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = task.description?.toLowerCase().includes(searchTerm);
        
        if (titleMatch || descriptionMatch) {
          const categoryId = (task as any).categoryId;
          const category = categoryId ? categoryMap.get(categoryId) : null;

          results.push({
            id: task.id,
            type: 'task',
            title: task.title,
            snippet: this.generateSnippet(task.title, task.description || '', searchTerm),
            createdAt: task.createdAt.toISOString(),
            when: task.dueDate ? task.dueDate.toISOString() : undefined,
            category: category ? {
              id: category.id,
              name: category.name,
              color: category.color,
            } : null,
          });
        }
      }
    }

    // Buscar notes
    if (typesToSearch.includes('note')) {
      const notes = await this.noteRepository.findByUserId(userId);
      for (const note of notes) {
        // Filtrar por categoria
        if (dto.categoryIds && dto.categoryIds.length > 0) {
          const noteCategoryId = (note as any).categoryId;
          if (!noteCategoryId || !dto.categoryIds.includes(noteCategoryId)) {
            continue;
          }
        }

        // Filtrar por data
        if (dto.from && note.createdAt < new Date(dto.from)) continue;
        if (dto.to && note.createdAt > new Date(dto.to)) continue;

        const titleMatch = note.title?.toLowerCase().includes(searchTerm);
        const contentMatch = note.content.toLowerCase().includes(searchTerm);
        
        if (titleMatch || contentMatch) {
          const categoryId = (note as any).categoryId;
          const category = categoryId ? categoryMap.get(categoryId) : null;

          results.push({
            id: note.id,
            type: 'note',
            title: note.title || this.extractFirstLine(note.content),
            snippet: this.generateSnippet(note.title || '', note.content, searchTerm),
            createdAt: note.createdAt.toISOString(),
            category: category ? {
              id: category.id,
              name: category.name,
              color: category.color,
            } : null,
          });
        }
      }
    }

    // Buscar reminders
    if (typesToSearch.includes('reminder')) {
      const reminders = await this.reminderRepository.findByUserId(userId);
      for (const reminder of reminders) {
        // Filtrar por categoria
        if (dto.categoryIds && dto.categoryIds.length > 0) {
          const reminderCategoryId = (reminder as any).categoryId;
          if (!reminderCategoryId || !dto.categoryIds.includes(reminderCategoryId)) {
            continue;
          }
        }

        // Filtrar por status
        if (dto.status === 'done' && !reminder.completed) continue;
        if (dto.status === 'open' && reminder.completed) continue;

        // Filtrar por data
        if (dto.from && reminder.createdAt < new Date(dto.from)) continue;
        if (dto.to && reminder.createdAt > new Date(dto.to)) continue;

        const titleMatch = reminder.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = reminder.description?.toLowerCase().includes(searchTerm);
        
        if (titleMatch || descriptionMatch) {
          const categoryId = (reminder as any).categoryId;
          const category = categoryId ? categoryMap.get(categoryId) : null;

          results.push({
            id: reminder.id,
            type: 'reminder',
            title: reminder.title,
            snippet: this.generateSnippet(reminder.title, reminder.description || '', searchTerm),
            createdAt: reminder.createdAt.toISOString(),
            when: reminder.reminderDate.toISOString(),
            category: category ? {
              id: category.id,
              name: category.name,
              color: category.color,
            } : null,
          });
        }
      }
    }

    // Ordenar: match em title primeiro, depois por data (mais recente primeiro)
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Retornar top 20
    return results.slice(0, 20);
  }

  /**
   * Gera snippet do texto destacando o termo de busca
   */
  private generateSnippet(title: string, text: string, searchTerm: string): string {
    // Se o título contém o termo, usar título
    if (title.toLowerCase().includes(searchTerm)) {
      return title.length > 80 ? title.substring(0, 80) + '...' : title;
    }

    // Buscar no texto
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(searchTerm);
    
    if (index === -1) {
      // Se não encontrou, retornar primeiras linhas
      return this.extractFirstLine(text);
    }

    // Extrair trecho ao redor do match (50 chars antes e depois)
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let preview = text.substring(start, end);
    
    // Adicionar "..." se necessário
    if (start > 0) preview = '...' + preview;
    if (end < text.length) preview = preview + '...';

    return preview;
  }

  /**
   * Extrai primeira linha do texto
   */
  private extractFirstLine(text: string): string {
    const firstLine = text.split('\n')[0];
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
  }
}
