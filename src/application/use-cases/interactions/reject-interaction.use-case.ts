/**
 * Use Case: Rejeitar interação
 */
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';
import { AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class RejectInteractionUseCase {
  constructor(
    @Inject(AI_INTERACTION_REPOSITORY)
    private readonly aiInteractionRepository: AIInteractionRepository,
  ) {}

  async execute(userId: string, interactionId: string): Promise<void> {
    // Buscar interação
    const interaction = await this.aiInteractionRepository.findById(interactionId);

    if (!interaction) {
      throw new NotFoundException('Interação não encontrada');
    }

    // Verificar se é do usuário
    if (interaction.userId !== userId) {
      throw new NotFoundException('Interação não encontrada');
    }

    // Verificar se está pendente
    if (interaction.confirmed !== undefined) {
      throw new BadRequestException(
        `Interação já foi ${interaction.confirmed ? 'confirmada' : 'rejeitada'}`,
      );
    }

    // Atualizar interação como rejeitada
    const rejectedInteraction = interaction.reject();
    await this.aiInteractionRepository.update(rejectedInteraction);
  }
}

