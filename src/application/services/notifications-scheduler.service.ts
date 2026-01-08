/**
 * Scheduler Service para verificar itens vencidos e criar notificações
 */
import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { Notification, NotificationKind } from '@domain/entities/notification.entity';
import {
  TASK_REPOSITORY,
  REMINDER_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from '@infrastructure/auth/tokens';

@Injectable()
export class NotificationsSchedulerService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  @Cron('* * * * *') // A cada 1 minuto
  async checkOverdueItems() {
    const now = new Date();

    // Tasks vencidas
    const overdueTasks = await this.taskRepository.findOverdueTasks(now);
    for (const task of overdueTasks) {
      const exists = await this.notificationRepository.existsForEntity('Task', task.id);
      if (!exists) {
        const notification = Notification.create(
          task.userId,
          NotificationKind.TASK_DUE,
          `Tarefa vencida: ${task.title}`,
          task.description || 'Tarefa está vencida',
          'Task',
          task.id,
        );
        await this.notificationRepository.create(notification);
      }
    }

    // Reminders vencidos
    const overdueReminders = await this.reminderRepository.findOverdueReminders(now);
    for (const reminder of overdueReminders) {
      const exists = await this.notificationRepository.existsForEntity('Reminder', reminder.id);
      if (!exists) {
        const notification = Notification.create(
          reminder.userId,
          NotificationKind.REMINDER_DUE,
          `Lembrete: ${reminder.title}`,
          reminder.description || 'Lembrete está vencido',
          'Reminder',
          reminder.id,
        );
        await this.notificationRepository.create(notification);
      }
    }
  }
}

