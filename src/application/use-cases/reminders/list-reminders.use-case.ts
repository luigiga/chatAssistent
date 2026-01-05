/**
 * Use Case: Listar reminders do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Reminder } from '@domain/entities/reminder.entity';
import { REMINDER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class ListRemindersUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string): Promise<Reminder[]> {
    return await this.reminderRepository.findByUserId(userId);
  }
}

