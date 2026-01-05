/**
 * Use Case: Deletar reminder
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { REMINDER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class DeleteReminderUseCase {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(userId: string, reminderId: string): Promise<void> {
    // Buscar reminder
    const reminder = await this.reminderRepository.findById(reminderId);
    if (!reminder) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    // Verificar se pertence ao usuário
    if (reminder.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar este lembrete');
    }

    // Deletar
    await this.reminderRepository.delete(reminderId);
  }
}

