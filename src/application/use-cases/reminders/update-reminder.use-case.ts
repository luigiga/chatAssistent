/**
 * Use Case: Atualizar reminder
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Reminder, RecurrenceRule } from '@domain/entities/reminder.entity';
import { UpdateReminderDto } from '../../dto/update-reminder.dto';
import { REMINDER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class UpdateReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string, reminderId: string, dto: UpdateReminderDto): Promise<Reminder> {
    // Buscar reminder
    const reminder = await this.reminderRepository.findById(reminderId);
    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    // Verificar se pertence ao usuário
    if (reminder.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este lembrete');
    }

    // Atualizar reminder
    const reminderDate = dto.reminderDate ? new Date(dto.reminderDate) : reminder.reminderDate;
    const updatedReminder = reminder.update(
      dto.title,
      dto.description ?? undefined,
      reminderDate,
      dto.isRecurring,
      dto.recurrenceRule as RecurrenceRule | undefined,
    );

    // Persistir
    return await this.reminderRepository.update(updatedReminder);
  }
}

