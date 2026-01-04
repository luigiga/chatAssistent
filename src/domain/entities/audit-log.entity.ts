/**
 * Entidade de Log de Auditoria
 * Representa um log de auditoria no domínio da aplicação
 */
export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly action: string,
    public readonly entityType: string,
    public readonly entityId?: string,
    public readonly metadata?: Record<string, unknown>,
    public readonly createdAt?: Date,
  ) {}

  /**
   * Cria uma nova instância de AuditLog
   */
  static create(
    id: string,
    userId: string,
    action: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, unknown>,
  ): AuditLog {
    return new AuditLog(
      id,
      userId,
      action,
      entityType,
      entityId,
      metadata,
      new Date(),
    );
  }
}

