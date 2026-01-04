/**
 * Use Case: Interpretar mensagem do usuário usando IA
 */
import { Injectable, Inject } from '@nestjs/common';
import { AIProvider } from '@domain/interfaces/ai-provider.interface';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';
import { InterpretDto } from '../../dto/interpret.dto';
import { InterpretResponseDto } from '../../dto/interpret-response.dto';
import { randomUUID } from 'crypto';
import { AI_PROVIDER, AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class InterpretUseCase {
  constructor(
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AIProvider,
    @Inject(AI_INTERACTION_REPOSITORY)
    private readonly aiInteractionRepository: AIInteractionRepository,
  ) {}

  async execute(
    userId: string,
    dto: InterpretDto,
  ): Promise<InterpretResponseDto> {
    // Chamar provider de IA
    const interpretation = await this.aiProvider.interpret(dto.text);

    // Converter resposta para JSON string
    const aiResponseJson = JSON.stringify(interpretation);

    // Criar interação
    const interaction = AIInteraction.create(
      randomUUID(),
      userId,
      dto.text,
      aiResponseJson,
      interpretation.needs_confirmation,
    );

    // Persistir interação
    const savedInteraction = await this.aiInteractionRepository.create(
      interaction,
    );

    // Se não precisa de confirmação, a ação será executada automaticamente
    // (mas isso será feito em outro use case quando implementarmos a criação de tasks/notes)
    const executed = !interpretation.needs_confirmation;

    return {
      interpretation,
      interactionId: savedInteraction.id,
      executed,
    };
  }
}

