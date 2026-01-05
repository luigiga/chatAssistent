/**
 * Serviço de Cache para interpretações de IA
 * Evita chamadas repetidas para a API com inputs similares
 */
import { Injectable, Logger } from '@nestjs/common';
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';

interface CachedInterpretation {
  response: AIInterpretationResponse;
  timestamp: Date;
  hitCount: number;
}

@Injectable()
export class AICacheService {
  private readonly logger = new Logger(AICacheService.name);
  private cache = new Map<string, CachedInterpretation>();
  private readonly CACHE_TTL = 3600000; // 1 hora em milissegundos
  private readonly MAX_CACHE_SIZE = 1000;

  /**
   * Busca uma interpretação no cache
   * Retorna null se não encontrar ou se expirou
   */
  getCached(input: string): AIInterpretationResponse | null {
    const key = this.normalizeInput(input);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Verificar se expirou
    const age = Date.now() - cached.timestamp.getTime();
    if (age > this.CACHE_TTL) {
      this.cache.delete(key);
      this.logger.debug(`Cache expirado para: ${key.substring(0, 50)}...`);
      return null;
    }

    cached.hitCount++;
    this.logger.debug(`Cache hit para: ${key.substring(0, 50)}... (${cached.hitCount} hits)`);
    return cached.response;
  }

  /**
   * Armazena uma interpretação no cache
   */
  setCached(input: string, response: AIInterpretationResponse): void {
    const key = this.normalizeInput(input);

    // Limpar cache se muito grande
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    this.cache.set(key, {
      response,
      timestamp: new Date(),
      hitCount: 0,
    });

    this.logger.debug(`Cache armazenado para: ${key.substring(0, 50)}...`);
  }

  /**
   * Normaliza o input para criar uma chave de cache consistente
   */
  private normalizeInput(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Múltiplos espaços -> um espaço
      .replace(/[^\w\s]/g, '') // Remove pontuação
      .substring(0, 200); // Limita tamanho da chave
  }

  /**
   * Remove a entrada mais antiga do cache
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp.getTime() < oldestTime) {
        oldestTime = value.timestamp.getTime();
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.logger.debug(`Cache evict: removida entrada mais antiga`);
    }
  }

  /**
   * Limpa todo o cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Cache limpo');
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}

