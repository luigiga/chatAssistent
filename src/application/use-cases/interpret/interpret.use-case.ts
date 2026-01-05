/**
 * Use Case: Interpretar mensagem do usuário usando IA
 */
import { Injectable, Inject } from '@nestjs/common';
import { AIProvider } from '@domain/interfaces/ai-provider.interface';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIQuotaUsageRepository } from '@domain/interfaces/repositories/ai-quota-usage.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';
import { InterpretDto } from '../../dto/interpret.dto';
import { InterpretResponseDto } from '../../dto/interpret-response.dto';
import { CreateTaskUseCase } from '../tasks/create-task.use-case';
import { CreateNoteUseCase } from '../notes/create-note.use-case';
import { CreateReminderUseCase } from '../reminders/create-reminder.use-case';
import { AIRateLimiter } from '@infrastructure/ai/ai-rate-limiter.service';
import { AICacheService } from '@infrastructure/ai/ai-cache.service';
import { CircuitBreakerService } from '@infrastructure/ai/circuit-breaker.service';
import { Task, TaskPriority } from '@domain/entities/task.entity';
import { Note } from '@domain/entities/note.entity';
import { Reminder } from '@domain/entities/reminder.entity';
import { randomUUID } from 'crypto';
import {
  AI_PROVIDER,
  AI_INTERACTION_REPOSITORY,
  AI_QUOTA_USAGE_REPOSITORY,
} from '@infrastructure/auth/tokens';

@Injectable()
export class InterpretUseCase {
  constructor(
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AIProvider,
    @Inject(AI_INTERACTION_REPOSITORY)
    private readonly aiInteractionRepository: AIInteractionRepository,
    @Inject(AI_QUOTA_USAGE_REPOSITORY)
    private readonly aiQuotaUsageRepository: AIQuotaUsageRepository,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly createReminderUseCase: CreateReminderUseCase,
    private readonly rateLimiter: AIRateLimiter,
    private readonly aiCache: AICacheService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  async execute(
    userId: string,
    dto: InterpretDto,
  ): Promise<InterpretResponseDto> {
    // 1. Verificar cache primeiro
    const cached = this.aiCache.getCached(dto.text);
    if (cached) {
      // Criar interação mesmo para cache (para auditoria)
      const interaction = AIInteraction.create(
        randomUUID(),
        userId,
        dto.text,
        JSON.stringify(cached),
        cached.needs_confirmation,
      );
      await this.aiInteractionRepository.create(interaction);

      return {
        interpretation: cached,
        interactionId: interaction.id,
        executed: false,
      };
    }

    // 2. Verificar rate limit
    if (!this.rateLimiter.canMakeRequest(userId)) {
      const dailyLimit = this.rateLimiter.getDailyLimit(userId);
      const interpretation = {
        needs_confirmation: true,
        action_type: 'unknown' as const,
        confirmation_message: `Você atingiu o limite diário de ${dailyLimit} requisições. Tente novamente amanhã.`,
      };

      const interaction = AIInteraction.create(
        randomUUID(),
        userId,
        dto.text,
        JSON.stringify(interpretation),
        true,
      );
      await this.aiInteractionRepository.create(interaction);

      return {
        interpretation,
        interactionId: interaction.id,
        executed: false,
      };
    }

    // 3. Verificar circuit breaker
    if (!this.circuitBreaker.canAttempt()) {
      const interpretation = {
        needs_confirmation: true,
        action_type: 'unknown' as const,
        confirmation_message:
          'Serviço de IA temporariamente indisponível. Tente novamente em alguns instantes.',
      };

      const interaction = AIInteraction.create(
        randomUUID(),
        userId,
        dto.text,
        JSON.stringify(interpretation),
        true,
      );
      await this.aiInteractionRepository.create(interaction);

      return {
        interpretation,
        interactionId: interaction.id,
        executed: false,
      };
    }

    // 4. Chamar provider de IA (com fallback automático)
    let interpretation;
    try {
      interpretation = await this.aiProvider.interpret(dto.text);
      this.circuitBreaker.recordSuccess();
      this.rateLimiter.recordRequest(userId);

      // Registrar quota no banco
      await this.aiQuotaUsageRepository.incrementRequestCount(userId, new Date());

      // Armazenar no cache
      this.aiCache.setCached(dto.text, interpretation);
    } catch (error) {
      this.circuitBreaker.recordFailure();
      // O FallbackAIProvider já deve ter tratado, mas se ainda assim falhar:
      interpretation = {
        needs_confirmation: true,
        action_type: 'unknown' as const,
        confirmation_message: 'Erro ao processar sua solicitação. Pode tentar novamente?',
      };
    }

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

    // Se não precisa de confirmação, executar ação automaticamente
    let createdEntity: Task | Note | Reminder | null = null;
    let executed = false;

    if (!interpretation.needs_confirmation && interpretation.action_type !== 'unknown') {
      try {
        if (interpretation.action_type === 'task' && interpretation.task) {
          const task = await this.createTaskUseCase.execute(userId, {
            title: interpretation.task.title,
            description: interpretation.task.description,
            dueDate: interpretation.task.due_date ? new Date(interpretation.task.due_date) : undefined,
            priority: interpretation.task.priority as TaskPriority | undefined,
          });
          createdEntity = task;
          executed = true;
        } else if (interpretation.action_type === 'note' && interpretation.note) {
          const note = await this.createNoteUseCase.execute(userId, {
            title: interpretation.note.title,
            content: interpretation.note.content,
          });
          createdEntity = note;
          executed = true;
        } else if (interpretation.action_type === 'reminder' && interpretation.reminder) {
          const reminder = await this.createReminderUseCase.execute(userId, {
            title: interpretation.reminder.title,
            description: interpretation.reminder.description,
            reminderDate: interpretation.reminder.reminder_date,
            isRecurring: interpretation.reminder.is_recurring || false,
            recurrenceRule: interpretation.reminder.recurrence_rule,
          });
          createdEntity = reminder;
          executed = true;
        }
      } catch (error) {
        // Se houver erro ao criar, marcar como não executado
        // mas ainda retornar a interpretação
        executed = false;
        console.error('Erro ao executar ação automaticamente:', error);
      }
    }

    return {
      interpretation,
      interactionId: savedInteraction.id,
      executed,
      createdEntity: createdEntity && interpretation.action_type !== 'unknown'
        ? {
            id: createdEntity.id,
            type: interpretation.action_type as 'task' | 'note' | 'reminder',
          }
        : undefined,
    };
  }
}

