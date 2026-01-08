/**
 * Use Case: Marcar notificação como lida
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { Notification } from '@domain/entities/notification.entity';
import { NOTIFICATION_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada');
    }

    const markedAsRead = notification.markAsRead();
    return await this.notificationRepository.update(markedAsRead);
  }
}

