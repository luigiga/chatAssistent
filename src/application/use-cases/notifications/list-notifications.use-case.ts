/**
 * Use Case: Listar notificações do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { Notification } from '@domain/entities/notification.entity';
import { NOTIFICATION_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    return await this.notificationRepository.findByUserId(userId, unreadOnly);
  }
}

