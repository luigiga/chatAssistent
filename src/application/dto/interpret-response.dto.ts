/**
 * DTO de resposta da interpretação
 */
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';

export interface InterpretResponseDto {
  /**
   * Resposta da IA
   */
  interpretation: AIInterpretationResponse;

  /**
   * ID da interação salva (se foi persistida)
   */
  interactionId?: string;

  /**
   * Indica se a ação foi executada automaticamente
   */
  executed: boolean;

  /**
   * Entidade criada automaticamente (se executed = true)
   */
  createdEntity?: {
    id: string;
    type: 'task' | 'note' | 'reminder';
  };
}

