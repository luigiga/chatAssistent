/**
 * Circuit Breaker para proteção da API de IA
 * Evita chamadas excessivas quando a API está falhando
 */
import { Injectable, Logger } from '@nestjs/common';

enum CircuitState {
  CLOSED = 'CLOSED', // Funcionando normalmente
  OPEN = 'OPEN', // Bloqueado (muitos erros)
  HALF_OPEN = 'HALF_OPEN', // Testando se recuperou
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly FAILURE_THRESHOLD = 5; // 5 falhas consecutivas para abrir
  private readonly TIMEOUT = 60000; // 1 minuto em estado OPEN antes de tentar recuperar
  private readonly SUCCESS_THRESHOLD = 2; // 2 sucessos consecutivos para fechar

  /**
   * Verifica se pode tentar uma requisição
   */
  canAttempt(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return true;
    }

    if (this.state === CircuitState.OPEN) {
      // Verificar se timeout passou
      if (Date.now() - this.lastFailureTime > this.TIMEOUT) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
        this.logger.log('Circuit breaker: Tentando recuperação (HALF_OPEN)');
        return true;
      }
      this.logger.debug('Circuit breaker: Bloqueado (OPEN)');
      return false;
    }

    // HALF_OPEN: permitir tentativa
    return true;
  }

  /**
   * Registra um sucesso
   */
  recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.SUCCESS_THRESHOLD) {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.logger.log('Circuit breaker: Recuperado (CLOSED)');
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Resetar contador de falhas em caso de sucesso
      this.failureCount = 0;
    }
  }

  /**
   * Registra uma falha
   */
  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // Se falhar em HALF_OPEN, voltar para OPEN
      this.state = CircuitState.OPEN;
      this.successCount = 0;
      this.logger.warn('Circuit breaker: Falha durante recuperação. Voltando para OPEN');
    } else if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = CircuitState.OPEN;
      this.logger.warn(
        `Circuit breaker: Abrindo (OPEN) - ${this.failureCount} falhas consecutivas`,
      );
    }
  }

  /**
   * Retorna o estado atual
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Retorna estatísticas do circuit breaker
   */
  getStats(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
    };
  }

  /**
   * Força reset do circuit breaker (útil para testes ou recuperação manual)
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.logger.log('Circuit breaker: Resetado manualmente');
  }
}

