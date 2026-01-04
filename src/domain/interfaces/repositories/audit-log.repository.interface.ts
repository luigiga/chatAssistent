/**
 * Interface do Repositório de Audit Log
 * Define o contrato para persistência de logs de auditoria
 */
import { AuditLog } from '../../entities/audit-log.entity';

export interface AuditLogRepository {
  /**
   * Cria um novo log de auditoria
   */
  create(log: AuditLog): Promise<AuditLog>;

  /**
   * Busca logs de um usuário
   */
  findByUserId(userId: string, limit?: number): Promise<AuditLog[]>;

  /**
   * Busca logs por tipo de entidade
   */
  findByEntityType(
    entityType: string,
    entityId?: string,
  ): Promise<AuditLog[]>;
}

