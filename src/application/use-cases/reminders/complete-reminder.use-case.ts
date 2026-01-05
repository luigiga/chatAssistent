/**
 * Use Case: Completar reminder
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Reminder } from '@domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class CompleteReminderUseCase {
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
      throw new ForbiddenException('Você não tem permissão para completar este lembrete');
    }

    // Completar reminder
    const completedReminder = reminder.complete();

    // Persistir
    return await this.reminderRepository.update(completedReminder);
  }
}

