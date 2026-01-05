/**
 * Use Case: Listar interações pendentes do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';
import { PendingInteractionResponseDto } from '../../dto/pending-interaction-response.dto';
import { AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';

@Injectable()
export class ListPendingInteractionsUseCase {
  constructor(
    @Inject(AI_INTERACTION_REPOSITORY)
    private readonly aiInteractionRepository: AIInteractionRepository,
  ) {}

  async execute(userId: string): Promise<PendingInteractionResponseDto[]> {
    // Buscar todas as interações do usuário
    const interactions = await this.aiInteractionRepository.findByUserId(userId);

    // Filtrar apenas as pendentes (needsConfirmation = true e confirmed = undefined)
    const pendingInteractions = interactions.filter(
      (interaction) =>
        interaction.needsConfirmation && interaction.confirmed === undefined,
    );

    // Mapear para DTO
    return pendingInteractions.map((interaction) => {
      let interpretation: AIInterpretationResponse;
      try {
        interpretation = JSON.parse(interaction.aiResponse);
      } catch {
        interpretation = {
          needs_confirmation: true,
          action_type: 'unknown',
          confirmation_message: 'Erro ao processar interação',
        };
      }

      return {
        id: interaction.id,
        userInput: interaction.userInput,
        interpretation,
        confirmationMessage: interpretation.confirmation_message,
        createdAt: interaction.createdAt || new Date(),
      };
    });
  }
}

