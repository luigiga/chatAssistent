/**
 * Use Case: Listar memórias (tasks, notes, reminders) formatadas
 */
import { Injectable, Inject } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { ListMemoriesDto } from '../../dto/list-memories.dto';
import {
  TASK_REPOSITORY,
  NOTE_REPOSITORY,
  REMINDER_REPOSITORY,
} from '@infrastructure/auth/tokens';

export interface MemoryResponse {
  id: string;
  type: 'task' | 'note' | 'reminder';
  content?: string;
  interpretation: {
    action_type: 'task' | 'note' | 'reminder';
    task?: {
      title: string;
      description?: string;
      due_date?: string;
      priority?: 'low' | 'medium' | 'high';
    };
    note?: {
      title?: string;
      content: string;
    };
    reminder?: {
      title: string;
      description?: string;
      reminder_date: string;
      is_recurring?: boolean;
      recurrence_rule?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    };
    needs_confirmation: boolean;
  };
  timestamp: Date;
  metadata?: {
    completed?: boolean;
    completedAt?: Date;
    isFavorite?: boolean;
    isPinned?: boolean;
    category?: {
      id: string;
      name: string;
      color: string;
    };
  };
}

@Injectable()
export class ListMemoriesUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string, dto: ListMemoriesDto): Promise<MemoryResponse[]> {
    const memories: MemoryResponse[] = [];

    if (dto.space === 'reminders') {
      // Buscar apenas lembretes pendentes
      const reminders = await this.reminderRepository.findByUserId(userId);
      const pendingReminders = reminders.filter((r) => !r.completed);
      pendingReminders.sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());

      for (const reminder of pendingReminders) {
        memories.push({
          id: reminder.id,
          type: 'reminder',
          interpretation: {
            action_type: 'reminder',
            reminder: {
              title: reminder.title,
              description: reminder.description,
              reminder_date: reminder.reminderDate.toISOString(),
              is_recurring: reminder.isRecurring,
              recurrence_rule: reminder.recurrenceRule as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | 'yearly'
                | undefined,
            },
            needs_confirmation: false,
          },
          timestamp: reminder.createdAt || reminder.reminderDate,
          metadata: {
            completed: reminder.completed,
            completedAt: reminder.completedAt,
            isFavorite: reminder.isFavorite,
            isPinned: reminder.isPinned,
            category: (reminder as any).category
              ? {
                  id: (reminder as any).category.id,
                  name: (reminder as any).category.name,
                  color: (reminder as any).category.color,
                }
              : undefined,
          },
        });
      }
    } else if (dto.space === 'favorites') {
      // Buscar apenas favoritos
      const [tasks, notes, reminders] = await Promise.all([
        this.taskRepository.findByUserId(userId),
        this.noteRepository.findByUserId(userId),
        this.reminderRepository.findByUserId(userId),
      ]);

      // Filtrar apenas favoritos
      const favoriteTasks = tasks.filter((t) => t.isFavorite);
      const favoriteNotes = notes.filter((n) => n.isFavorite);
      const favoriteReminders = reminders.filter((r) => r.isFavorite);

      // Converter tasks favoritas
      for (const task of favoriteTasks) {
        memories.push({
          id: task.id,
          type: 'task',
          interpretation: {
            action_type: 'task',
            task: {
              title: task.title,
              description: task.description,
              due_date: task.dueDate?.toISOString(),
              priority: task.priority as 'low' | 'medium' | 'high' | undefined,
            },
            needs_confirmation: false,
          },
          timestamp: task.createdAt || new Date(),
          metadata: {
            completed: task.completed,
            completedAt: task.completedAt,
            isFavorite: task.isFavorite,
            isPinned: task.isPinned,
          },
        });
      }

      // Converter notes favoritas
      for (const note of favoriteNotes) {
        memories.push({
          id: note.id,
          type: 'note',
          content: note.content,
          interpretation: {
            action_type: 'note',
            note: {
              title: note.title,
              content: note.content,
            },
            needs_confirmation: false,
          },
          timestamp: note.createdAt || new Date(),
          metadata: {
            isFavorite: note.isFavorite,
            isPinned: note.isPinned,
            category: (note as any).category
              ? {
                  id: (note as any).category.id,
                  name: (note as any).category.name,
                  color: (note as any).category.color,
                }
              : undefined,
          },
        });
      }

      // Converter reminders favoritos
      for (const reminder of favoriteReminders) {
        memories.push({
          id: reminder.id,
          type: 'reminder',
          interpretation: {
            action_type: 'reminder',
            reminder: {
              title: reminder.title,
              description: reminder.description,
              reminder_date: reminder.reminderDate.toISOString(),
              is_recurring: reminder.isRecurring,
              recurrence_rule: reminder.recurrenceRule as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | 'yearly'
                | undefined,
            },
            needs_confirmation: false,
          },
          timestamp: reminder.createdAt || reminder.reminderDate,
          metadata: {
            completed: reminder.completed,
            completedAt: reminder.completedAt,
            isFavorite: reminder.isFavorite,
            isPinned: reminder.isPinned,
            category: (reminder as any).category
              ? {
                  id: (reminder as any).category.id,
                  name: (reminder as any).category.name,
                  color: (reminder as any).category.color,
                }
              : undefined,
          },
        });
      }

      // Ordenar: pinned primeiro, depois por timestamp
      memories.sort((a, b) => {
        const aPinned = a.metadata?.isPinned || false;
        const bPinned = b.metadata?.isPinned || false;
        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1;
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
    } else {
      // Buscar tasks, notes e reminders
      const [tasks, notes, reminders] = await Promise.all([
        this.taskRepository.findByUserId(userId),
        this.noteRepository.findByUserId(userId),
        this.reminderRepository.findByUserId(userId),
      ]);

      // Converter tasks
      for (const task of tasks) {
        memories.push({
          id: task.id,
          type: 'task',
          interpretation: {
            action_type: 'task',
            task: {
              title: task.title,
              description: task.description,
              due_date: task.dueDate?.toISOString(),
              priority: task.priority as 'low' | 'medium' | 'high' | undefined,
            },
            needs_confirmation: false,
          },
          timestamp: task.createdAt || new Date(),
          metadata: {
            completed: task.completed,
            completedAt: task.completedAt,
            isFavorite: task.isFavorite,
            isPinned: task.isPinned,
          },
        });
      }

      // Converter notes
      for (const note of notes) {
        memories.push({
          id: note.id,
          type: 'note',
          content: note.content,
          interpretation: {
            action_type: 'note',
            note: {
              title: note.title,
              content: note.content,
            },
            needs_confirmation: false,
          },
          timestamp: note.createdAt || new Date(),
          metadata: {
            isFavorite: note.isFavorite,
            isPinned: note.isPinned,
            category: (note as any).category
              ? {
                  id: (note as any).category.id,
                  name: (note as any).category.name,
                  color: (note as any).category.color,
                }
              : undefined,
          },
        });
      }

      // Converter reminders
      for (const reminder of reminders) {
        memories.push({
          id: reminder.id,
          type: 'reminder',
          interpretation: {
            action_type: 'reminder',
            reminder: {
              title: reminder.title,
              description: reminder.description,
              reminder_date: reminder.reminderDate.toISOString(),
              is_recurring: reminder.isRecurring,
              recurrence_rule: reminder.recurrenceRule as
                | 'daily'
                | 'weekly'
                | 'monthly'
                | 'yearly'
                | undefined,
            },
            needs_confirmation: false,
          },
          timestamp: reminder.createdAt || reminder.reminderDate,
          metadata: {
            completed: reminder.completed,
            completedAt: reminder.completedAt,
            isFavorite: reminder.isFavorite,
            isPinned: reminder.isPinned,
            category: (reminder as any).category
              ? {
                  id: (reminder as any).category.id,
                  name: (reminder as any).category.name,
                  color: (reminder as any).category.color,
                }
              : undefined,
          },
        });
      }

      // Ordenar: pinned primeiro, depois por timestamp (mais recente primeiro)
      memories.sort((a, b) => {
        const aPinned = a.metadata?.isPinned || false;
        const bPinned = b.metadata?.isPinned || false;
        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1; // pinned primeiro
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
    }

    return memories;
  }
}

