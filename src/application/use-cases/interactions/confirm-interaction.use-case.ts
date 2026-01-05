/**
 * Use Case: Confirmar interação e executar ação
 */
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';
import { CreateTaskUseCase } from '../tasks/create-task.use-case';
import { CreateNoteUseCase } from '../notes/create-note.use-case';
import { CreateReminderUseCase } from '../reminders/create-reminder.use-case';
import { Task, TaskPriority } from '@domain/entities/task.entity';
import { Note } from '@domain/entities/note.entity';
import { Reminder } from '@domain/entities/reminder.entity';
import { AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';

export interface ConfirmInteractionResponseDto {
  interactionId: string;
  executed: boolean;
  createdEntity?: {
    id: string;
    type: 'task' | 'note' | 'reminder';
  };
}

@Injectable()
export class ConfirmInteractionUseCase {
  constructor(
    @Inject(AI_INTERACTION_REPOSITORY)
    private readonly aiInteractionRepository: AIInteractionRepository,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly createReminderUseCase: CreateReminderUseCase,
  ) {}

  async execute(
    userId: string,
    interactionId: string,
  ): Promise<ConfirmInteractionResponseDto> {
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

    // Verificar se precisa de confirmação
    if (!interaction.needsConfirmation) {
      throw new BadRequestException('Esta interação não requer confirmação');
    }

    // Parsear resposta da IA
    let interpretation: AIInterpretationResponse;
    try {
      interpretation = JSON.parse(interaction.aiResponse);
    } catch (error) {
      throw new BadRequestException('Resposta da IA inválida');
    }

    // Executar ação baseada no tipo
    let createdEntity: Task | Note | Reminder | null = null;
    let executed = false;

    if (interpretation.action_type !== 'unknown') {
      try {
        if (interpretation.action_type === 'task' && interpretation.task) {
          const task = await this.createTaskUseCase.execute(userId, {
            title: interpretation.task.title,
            description: interpretation.task.description,
            dueDate: interpretation.task.due_date
              ? new Date(interpretation.task.due_date)
              : undefined,
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
        } else if (
          interpretation.action_type === 'reminder' &&
          interpretation.reminder
        ) {
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
        executed = false;
        console.error('Erro ao executar ação:', error);
        throw new BadRequestException('Erro ao executar ação. Tente novamente.');
      }
    }

    // Atualizar interação como confirmada
    const confirmedInteraction = interaction.confirm();
    await this.aiInteractionRepository.update(confirmedInteraction);

    return {
      interactionId: confirmedInteraction.id,
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

