/**
 * Serviço de Rate Limiting para IA
 * Controla quantas requisições cada usuário pode fazer por dia
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UserQuota {
  userId: string;
  requestsToday: number;
  lastReset: Date;
  dailyLimit: number;
}

@Injectable()
export class AIRateLimiter {
  private readonly logger = new Logger(AIRateLimiter.name);
  private userQuotas = new Map<string, UserQuota>();
  private readonly DEFAULT_DAILY_LIMIT = 50;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Verifica se o usuário pode fazer uma requisição
   */
  canMakeRequest(userId: string): boolean {
    const quota = this.getOrCreateQuota(userId);
    this.resetIfNeeded(quota);
    return quota.requestsToday < quota.dailyLimit;
  }

  /**
   * Registra uma requisição do usuário
   */
  recordRequest(userId: string): void {
    const quota = this.getOrCreateQuota(userId);
    this.resetIfNeeded(quota);
    quota.requestsToday++;
    this.logger.debug(
      `Usuário ${userId}: ${quota.requestsToday}/${quota.dailyLimit} requisições hoje`,
    );
  }

  /**
   * Retorna quantas requisições o usuário ainda pode fazer
   */
  getRemainingRequests(userId: string): number {
    const quota = this.getOrCreateQuota(userId);
    this.resetIfNeeded(quota);
    return Math.max(0, quota.dailyLimit - quota.requestsToday);
  }

  /**
   * Retorna o limite diário do usuário
   */
  getDailyLimit(userId: string): number {
    const quota = this.getOrCreateQuota(userId);
    return quota.dailyLimit;
  }

  private getOrCreateQuota(userId: string): UserQuota {
    if (!this.userQuotas.has(userId)) {
      const dailyLimit = parseInt(
        this.configService.get<string>('AI_DAILY_LIMIT_PER_USER') ||
          String(this.DEFAULT_DAILY_LIMIT),
        10,
      );

      this.userQuotas.set(userId, {
        userId,
        requestsToday: 0,
        lastReset: new Date(),
        dailyLimit,
      });
    }
    return this.userQuotas.get(userId)!;
  }

  private resetIfNeeded(quota: UserQuota): void {
    const now = new Date();
    const daysSinceReset = Math.floor(
      (now.getTime() - quota.lastReset.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceReset >= 1) {
      quota.requestsToday = 0;
      quota.lastReset = now;
      this.logger.debug(`Quota resetada para usuário ${quota.userId}`);
    }
  }
}

