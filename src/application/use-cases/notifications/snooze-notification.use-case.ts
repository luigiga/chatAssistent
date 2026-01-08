/**
 * Use Case: Adiar (snooze) uma notificação
 */
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Notification } from '@domain/entities/notification.entity';
import { SnoozeNotificationDto } from '../../dto/snooze-notification.dto';
import {
  NOTIFICATION_REPOSITORY,
  TASK_REPOSITORY,
  REMINDER_REPOSITORY,
} from '@infrastructure/auth/tokens';

@Injectable()
export class SnoozeNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(
    userId: string,
    notificationId: string,
    dto: SnoozeNotificationDto,
  ): Promise<{
    notification: Notification;
    updatedEntitySummary: { id: string; type: string; newDate: string };
  }> {
    // 1. Buscar e validar notificação
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada');
    }

    // 2. Validar entityType
    if (notification.entityType !== 'Task' && notification.entityType !== 'Reminder') {
      throw new BadRequestException('Tipo de entidade inválido. Apenas Task e Reminder podem ser adiados');
    }

    // 3. Buscar entidade e validar não concluída
    let updatedEntitySummary: { id: string; type: string; newDate: string };

    if (notification.entityType === 'Task') {
      const task = await this.taskRepository.findById(notification.entityId);
      if (!task) {
        throw new NotFoundException('Tarefa não encontrada');
      }
      if (task.completed) {
        throw new BadRequestException('Não é possível adiar uma tarefa já concluída');
      }

      // 4. Calcular nova data
      const newDate = this.calculateNewDate(dto);

      // 5. Atualizar entidade
      const updatedTask = task.update(undefined, undefined, newDate);
      await this.taskRepository.update(updatedTask);

      updatedEntitySummary = {
        id: task.id,
        type: 'Task',
        newDate: newDate.toISOString(),
      };
    } else {
      // Reminder
      const reminder = await this.reminderRepository.findById(notification.entityId);
      if (!reminder) {
        throw new NotFoundException('Lembrete não encontrado');
      }
      if (reminder.completed) {
        throw new BadRequestException('Não é possível adiar um lembrete já concluído');
      }

      // 4. Calcular nova data
      const newDate = this.calculateNewDate(dto);

      // 5. Atualizar entidade
      const updatedReminder = reminder.update(undefined, undefined, newDate);
      await this.reminderRepository.update(updatedReminder);

      updatedEntitySummary = {
        id: reminder.id,
        type: 'Reminder',
        newDate: newDate.toISOString(),
      };
    }

    // 6. Marcar notificação como lida
    const markedAsRead = notification.markAsRead();
    const updatedNotification = await this.notificationRepository.update(markedAsRead);

    // 7. Retornar resultado
    return {
      notification: updatedNotification,
      updatedEntitySummary,
    };
  }

  private calculateNewDate(dto: SnoozeNotificationDto): Date {
    const now = new Date();

    switch (dto.mode) {
      case 'minutes':
        if (!dto.minutes) {
          throw new BadRequestException('Parâmetro minutes é obrigatório para o modo minutes');
        }
        return new Date(now.getTime() + dto.minutes * 60000);

      case 'until':
        if (!dto.until) {
          throw new BadRequestException('Parâmetro until é obrigatório para o modo until');
        }
        const untilDate = new Date(dto.until);
        if (isNaN(untilDate.getTime())) {
          throw new BadRequestException('Data until inválida');
        }
        if (untilDate.getTime() <= now.getTime()) {
          throw new BadRequestException('Data until deve ser no futuro');
        }
        return untilDate;

      case 'tomorrow_9':
        // TODO: usar timezone do perfil do usuário quando existir
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;

      default:
        throw new BadRequestException('Modo inválido');
    }
  }
}

