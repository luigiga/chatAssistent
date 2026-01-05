/**
 * Use Case: Criar reminder
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { Reminder, RecurrenceRule } from '@domain/entities/reminder.entity';
import { CreateReminderDto } from '../../dto/create-reminder.dto';
import { randomUUID } from 'crypto';
import { REMINDER_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class CreateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, dto: CreateReminderDto): Promise<Reminder> {
    // Verificar se usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Criar reminder
    const reminderId = randomUUID();
    const reminderDate = new Date(dto.reminderDate);
    const reminder = Reminder.create(
      reminderId,
      userId,
      dto.title,
      reminderDate,
      dto.description,
      dto.isRecurring,
      dto.recurrenceRule as RecurrenceRule | undefined,
    );

    // Persistir
    return await this.reminderRepository.create(reminder);
  }
}

