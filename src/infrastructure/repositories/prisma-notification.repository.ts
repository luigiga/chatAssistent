/**
 * Implementação Prisma do repositório de Notification
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationRepository } from '@domain/interfaces/repositories/notification.repository.interface';
import { Notification, NotificationKind } from '@domain/entities/notification.entity';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        kind: notification.kind,
        title: notification.title,
        body: notification.body,
        entityType: notification.entityType,
        entityId: notification.entityId,
        readAt: notification.readAt,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Notification | null> {
    const found = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    const where: any = { userId };
    
    if (unreadOnly) {
      where.readAt = null;
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 30, // Limitar a 30
    });

    return notifications.map((notification) => this.mapToDomain(notification));
  }

  async update(notification: Notification): Promise<Notification> {
    const updated = await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        kind: notification.kind,
        title: notification.title,
        body: notification.body,
        entityType: notification.entityType,
        entityId: notification.entityId,
        readAt: notification.readAt,
      },
    });

    return this.mapToDomain(updated);
  }

  async existsForEntity(entityType: string, entityId: string): Promise<boolean> {
    const count = await this.prisma.notification.count({
      where: {
        entityType,
        entityId,
      },
    });

    return count > 0;
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  private mapToDomain(prismaNotification: any): Notification {
    return Notification.fromPersistence(
      prismaNotification.id,
      prismaNotification.userId,
      prismaNotification.kind as NotificationKind,
      prismaNotification.title,
      prismaNotification.body,
      prismaNotification.entityType as 'Task' | 'Reminder',
      prismaNotification.entityId,
      prismaNotification.readAt ? new Date(prismaNotification.readAt) : null,
      prismaNotification.createdAt ? new Date(prismaNotification.createdAt) : new Date(),
    );
  }
}

