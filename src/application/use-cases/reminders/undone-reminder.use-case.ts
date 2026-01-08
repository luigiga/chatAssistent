/**
 * Use Case: Desfazer conclusão de reminder
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Reminder } from '@domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class UndoneReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string, reminderId: string): Promise<Reminder> {
    // Buscar reminder
    const reminder = await this.reminderRepository.findById(reminderId);
    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    // Verificar se pertence ao usuário
    if (reminder.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para desfazer este lembrete');
    }

    // Desfazer conclusão: criar novo reminder com completed = false e completedAt = null
    const undoneReminder = new Reminder(
      reminder.id,
      reminder.userId,
      reminder.title,
      reminder.reminderDate,
      reminder.description,
      reminder.isRecurring,
      reminder.recurrenceRule,
      false, // completed = false
      reminder.isFavorite,
      reminder.isPinned,
      reminder.createdAt,
      new Date(), // updatedAt
      undefined, // completedAt = null
    );

    // Persistir
    return await this.reminderRepository.update(undoneReminder);
  }
}


