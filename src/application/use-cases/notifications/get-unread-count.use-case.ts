/**
 * Use Case: Contar notificações não lidas do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { NOTIFICATION_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class GetUnreadCountUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return await this.notificationRepository.countUnread(userId);
  }
}

