/**
 * Use Case: Toggle pin de memória (task, note ou reminder)
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import {
  TASK_REPOSITORY,
  NOTE_REPOSITORY,
  REMINDER_REPOSITORY,
} from '@infrastructure/auth/tokens';

@Injectable()
export class TogglePinUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string, memoryId: string, type: 'task' | 'note' | 'reminder'): Promise<{ isPinned: boolean }> {
    if (type === 'task') {
      const task = await this.taskRepository.findById(memoryId);
      if (!task) {
        throw new NotFoundException('Tarefa não encontrada');
      }
      if (task.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar esta tarefa');
      }
      const updated = task.togglePin();
      await this.taskRepository.update(updated);
      return { isPinned: updated.isPinned };
    }

    if (type === 'note') {
      const note = await this.noteRepository.findById(memoryId);
      if (!note) {
        throw new NotFoundException('Nota não encontrada');
      }
      if (note.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar esta nota');
      }
      const updated = note.togglePin();
      await this.noteRepository.update(updated);
      return { isPinned: updated.isPinned };
    }

    if (type === 'reminder') {
      const reminder = await this.reminderRepository.findById(memoryId);
      if (!reminder) {
        throw new NotFoundException('Lembrete não encontrado');
      }
      if (reminder.userId !== userId) {
        throw new ForbiddenException('Você não tem permissão para alterar este lembrete');
      }
      const updated = reminder.togglePin();
      await this.reminderRepository.update(updated);
      return { isPinned: updated.isPinned };
    }

    throw new NotFoundException('Tipo de memória não reconhecido');
  }
}


