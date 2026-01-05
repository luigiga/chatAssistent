/**
 * Provider de IA com Fallback Automático
 * Tenta usar RealAIProvider, mas faz fallback para MockAIProvider em caso de erro
 */
import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';
import { RealAIProvider } from './real-ai-provider.service';
import { MockAIProvider } from './mock-ai-provider.service';

@Injectable()
export class FallbackAIProvider implements AIProvider {
  private readonly logger = new Logger(FallbackAIProvider.name);
  private quotaExceeded = false;
  private lastQuotaCheck = 0;
  private readonly QUOTA_CHECK_INTERVAL = 300000; // 5 minutos

  constructor(
    private readonly realProvider: RealAIProvider,
    private readonly mockProvider: MockAIProvider,
  ) {}

  async interpret(userInput: string): Promise<AIInterpretationResponse> {
    // Se quota foi excedida recentemente, usar mock diretamente
    if (this.quotaExceeded && Date.now() - this.lastQuotaCheck < this.QUOTA_CHECK_INTERVAL) {
      this.logger.debug('Usando MockAIProvider devido a quota excedida anteriormente');
      return this.mockProvider.interpret(userInput);
    }

    try {
      const result = await this.realProvider.interpret(userInput);
      // Se sucesso, resetar flag de quota
      if (this.quotaExceeded) {
        this.quotaExceeded = false;
        this.logger.log('Quota recuperada. Voltando a usar RealAIProvider');
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      
      // Detectar erros de quota (429, insufficient_quota)
      if (
        errorMessage.includes('429') ||
        errorMessage.includes('insufficient_quota') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('QUOTA_EXCEEDED')
      ) {
        this.quotaExceeded = true;
        this.lastQuotaCheck = Date.now();
        this.logger.warn('Quota da API excedida. Fazendo fallback para MockAIProvider');
      } else {
        this.logger.warn(`Erro na API real: ${errorMessage}. Fazendo fallback para MockAIProvider`);
      }

      // Fallback para mock
      return this.mockProvider.interpret(userInput);
    }
  }
}

