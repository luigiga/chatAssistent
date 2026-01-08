/**
 * Módulo de Notificações
 */
import { Module } from '@nestjs/common';
import { NotificationsController } from '../controllers/notifications.controller';
import { ListNotificationsUseCase } from '@application/use-cases/notifications/list-notifications.use-case';
import { MarkNotificationReadUseCase } from '@application/use-cases/notifications/mark-notification-read.use-case';
import { GetUnreadCountUseCase } from '@application/use-cases/notifications/get-unread-count.use-case';
import { SnoozeNotificationUseCase } from '@application/use-cases/notifications/snooze-notification.use-case';
import { NotificationsSchedulerService } from '@application/services/notifications-scheduler.service';
import { PrismaNotificationRepository } from '@infrastructure/repositories/prisma-notification.repository';
import { NOTIFICATION_REPOSITORY } from '@infrastructure/auth/tokens';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AuthModule } from './auth.module';
import { TasksModule } from './tasks.module';
import { RemindersModule } from './reminders.module';

@Module({
  imports: [AuthModule, TasksModule, RemindersModule],
  controllers: [NotificationsController],
  providers: [
    ListNotificationsUseCase,
    MarkNotificationReadUseCase,
    GetUnreadCountUseCase,
    SnoozeNotificationUseCase,
    NotificationsSchedulerService,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PrismaNotificationRepository,
    },
    PrismaService,
  ],
  exports: [NOTIFICATION_REPOSITORY, ListNotificationsUseCase, GetUnreadCountUseCase],
})
export class NotificationsModule {}

