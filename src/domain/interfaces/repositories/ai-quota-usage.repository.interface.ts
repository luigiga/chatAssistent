/**
 * Interface do Repositório de Quota de IA
 * Define o contrato para persistência de uso de quota
 */
export interface AIQuotaUsage {
  id: string;
  userId: string;
  date: Date;
  requestCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AIQuotaUsageRepository {
  /**
   * Busca ou cria registro de quota para um usuário em uma data
   */
  findOrCreate(userId: string, date: Date): Promise<AIQuotaUsage>;

  /**
   * Incrementa o contador de requisições
   */
  incrementRequestCount(userId: string, date: Date): Promise<AIQuotaUsage>;

  /**
   * Busca quota de um usuário em uma data específica
   */
  findByUserIdAndDate(userId: string, date: Date): Promise<AIQuotaUsage | null>;

  /**
   * Busca todas as quotas de um usuário
   */
  findByUserId(userId: string, limit?: number): Promise<AIQuotaUsage[]>;
}

