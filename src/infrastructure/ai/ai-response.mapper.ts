/**
 * Mapper para converter resposta da IA no formato esperado pelo domínio
 */
import { AIInterpretationResponse } from '@domain/interfaces/ai-provider.interface';
import { AIResponse } from './ai-response.validator';

/**
 * Converte a resposta da IA (formato simplificado) para o formato esperado pelo domínio
 */
export function mapAIResponseToDomain(aiResponse: AIResponse): AIInterpretationResponse {
  // Se intent é unknown, retornar unknown
  if (aiResponse.intent === 'unknown') {
    return {
      needs_confirmation: true,
      action_type: 'unknown',
      confirmation_message: 'Não consegui entender sua solicitação. Pode reformular?',
    };
  }

  // Para create_task, mapear para task
  if (aiResponse.intent === 'create_task') {
    const needsConfirmation = !aiResponse.title || aiResponse.title.trim().length < 3;

    return {
      needs_confirmation: needsConfirmation,
      action_type: 'task',
      task: {
        title: aiResponse.title || 'Nova Tarefa',
        description: aiResponse.description || undefined,
        due_date: aiResponse.dueDate || undefined,
        priority: aiResponse.priority || 'medium',
      },
      confirmation_message: needsConfirmation
        ? `Criar tarefa "${aiResponse.title || 'Nova Tarefa'}"?`
        : undefined,
    };
  }

  // Para outros intents, por enquanto retornar unknown
  // (update_task, delete_task, query_task podem ser implementados depois)
  return {
    needs_confirmation: true,
    action_type: 'unknown',
    confirmation_message: 'Ação não suportada ainda. Pode reformular?',
  };
}

