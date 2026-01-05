/**
 * DTO de resposta para interação pendente
 */
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';

export interface PendingInteractionResponseDto {
  id: string;
  userInput: string;
  interpretation: AIInterpretationResponse;
  confirmationMessage?: string;
  createdAt: Date;
}

