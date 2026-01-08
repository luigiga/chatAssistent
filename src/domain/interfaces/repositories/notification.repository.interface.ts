/**
 * Interface do Repositório de Notificação
 * Define o contrato para persistência de notificações
 */
import { Notification } from '@domain/entities/notification.entity';

export interface NotificationRepository {
  /**
   * Cria uma nova notificação
   */
  create(notification: Notification): Promise<Notification>;

  /**
   * Busca todas as notificações de um usuário
   */
  findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]>;

  /**
   * Busca uma notificação por ID
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * Atualiza uma notificação existente
   */
  update(notification: Notification): Promise<Notification>;

  /**
   * Verifica se já existe notificação para uma entidade
   */
  existsForEntity(entityType: string, entityId: string): Promise<boolean>;

  /**
   * Conta notificações não lidas de um usuário
   */
  countUnread(userId: string): Promise<number>;
}

