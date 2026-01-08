/**
 * Use Case: Atribuir categoria a memória (task, note ou reminder)
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { SetMemoryCategoryDto } from '../../dto/set-memory-category.dto';
import {
  TASK_REPOSITORY,
  NOTE_REPOSITORY,
  REMINDER_REPOSITORY,
  CATEGORY_REPOSITORY,
} from '@infrastructure/auth/tokens';

@Injectable()
export class SetMemoryCategoryUseCase {
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

  async execute(
    userId: string,
    memoryId: string,
    type: 'task' | 'note' | 'reminder',
    dto: SetMemoryCategoryDto,
  ): Promise<void> {
    // Verificar se a categoria existe e pertence ao usuário (se fornecida)
    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
      if (category.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para usar esta categoria');
      }
    }

    if (type === 'task') {
      const task = await this.taskRepository.findById(memoryId);
      if (!task) {
        throw new NotFoundException('Tarefa não encontrada');
      }
      if (task.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar esta tarefa');
      }
      // Atualizar task com categoryId
      const updated = task.update(
        undefined,
        undefined,
        undefined,
        undefined,
      );
      // Como a entidade Task não tem método para atualizar categoryId diretamente,
      // precisamos criar uma nova instância com o categoryId
      // Vou precisar atualizar a entidade Task para suportar categoryId
      // Por enquanto, vou usar o repositório diretamente
      await this.taskRepository.update({
        ...updated,
        categoryId: dto.categoryId || undefined,
      } as any);
    } else if (type === 'note') {
      const note = await this.noteRepository.findById(memoryId);
      if (!note) {
        throw new NotFoundException('Nota não encontrada');
      }
      if (note.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar esta nota');
      }
      await this.noteRepository.update({
        ...note,
        categoryId: dto.categoryId || undefined,
      } as any);
    } else if (type === 'reminder') {
      const reminder = await this.reminderRepository.findById(memoryId);
      if (!reminder) {
        throw new NotFoundException('Lembrete não encontrado');
      }
      if (reminder.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar este lembrete');
      }
      await this.reminderRepository.update({
        ...reminder,
        categoryId: dto.categoryId || undefined,
      } as any);
    } else {
      throw new NotFoundException('Tipo de memória não reconhecido');
    }
  }
}


