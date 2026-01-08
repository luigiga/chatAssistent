/**
 * Entidade de Notificação
 * Representa uma notificação de alerta para o usuário
 */
import { v4 as uuid } from 'uuid';

export enum NotificationKind {
  REMINDER_DUE = 'REMINDER_DUE',
  TASK_DUE = 'TASK_DUE',
}

export class Notification {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly kind: NotificationKind,
    public readonly title: string,
    public readonly body: string,
    public readonly entityType: 'Task' | 'Reminder',
    public readonly entityId: string,
    public readonly readAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  /**
   * Cria uma nova instância de Notification
   */
  static create(
    userId: string,
    kind: NotificationKind,
    title: string,
    body: string,
    entityType: 'Task' | 'Reminder',
    entityId: string,
  ): Notification {
    return new Notification(
      uuid(),
      userId,
      kind,
      title,
      body,
      entityType,
      entityId,
      null,
      new Date(),
    );
  }

  /**
   * Reconstrói uma Notification a partir de dados persistidos
   */
  static fromPersistence(
    id: string,
    userId: string,
    kind: NotificationKind,
    title: string,
    body: string,
    entityType: 'Task' | 'Reminder',
    entityId: string,
    readAt: Date | null,
    createdAt: Date,
  ): Notification {
    return new Notification(
      id,
      userId,
      kind,
      title,
      body,
      entityType,
      entityId,
      readAt,
      createdAt,
    );
  }

  /**
   * Marca a notificação como lida
   */
  markAsRead(): Notification {
    return new Notification(
      this.id,
      this.userId,
      this.kind,
      this.title,
      this.body,
      this.entityType,
      this.entityId,
      new Date(),
      this.createdAt,
    );
  }
}

