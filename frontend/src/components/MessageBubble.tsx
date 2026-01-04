/**
 * Balão de mensagem (usuário ou assistente)
 */
import { LoadingIndicator } from './LoadingIndicator';
import type { InterpretResponse } from '../services/api';

export type MemoryEntryType = 'user' | 'assistant' | 'error' | 'loading';

interface MemoryEntryProps {
  type: MemoryEntryType;
  content?: string;
  interpretation?: InterpretResponse['interpretation'];
}

function formatInterpretation(interpretation: InterpretResponse['interpretation']): string {
  const parts: string[] = [];

  if (interpretation.action_type === 'task' && interpretation.task) {
    parts.push(`📋 Tarefa: ${interpretation.task.title}`);
    if (interpretation.task.description) {
      parts.push(`   ${interpretation.task.description}`);
    }
    if (interpretation.task.due_date) {
      const date = new Date(interpretation.task.due_date);
      parts.push(`   📅 Prazo: ${date.toLocaleDateString('pt-BR')}`);
    }
    if (interpretation.task.priority) {
      const priorityLabels = { low: 'Baixa', medium: 'Média', high: 'Alta' };
      parts.push(`   ⚡ Prioridade: ${priorityLabels[interpretation.task.priority]}`);
    }
  } else if (interpretation.action_type === 'note' && interpretation.note) {
    parts.push(`📝 Nota: ${interpretation.note.title || 'Sem título'}`);
    if (interpretation.note.content) {
      parts.push(`   ${interpretation.note.content}`);
    }
  } else if (interpretation.action_type === 'reminder' && interpretation.reminder) {
    parts.push(`⏰ Lembrete: ${interpretation.reminder.title}`);
    if (interpretation.reminder.description) {
      parts.push(`   ${interpretation.reminder.description}`);
    }
    if (interpretation.reminder.reminder_date) {
      const date = new Date(interpretation.reminder.reminder_date);
      parts.push(`   📅 Data: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
    }
    if (interpretation.reminder.is_recurring) {
      parts.push(`   🔄 Recorrente: ${interpretation.reminder.recurrence_rule || 'Sim'}`);
    }
  } else if (interpretation.action_type === 'unknown') {
    parts.push('❓ Não consegui interpretar sua entrada.');
    if (interpretation.confirmation_message) {
      parts.push(`   ${interpretation.confirmation_message}`);
    }
  }

  if (interpretation.needs_confirmation && interpretation.confirmation_message) {
    parts.push(`\n⚠️ ${interpretation.confirmation_message}`);
  }

  return parts.join('\n');
}

export function MessageBubble({ type, content, interpretation }: MemoryEntryProps) {
  if (type === 'loading') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%] bg-red-50 border border-red-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <p className="text-red-700 text-sm">❌ {content || 'Erro ao processar entrada'}</p>
        </div>
      </div>
    );
  }

  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-blue-soft rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-text-primary text-sm whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    );
  }

  // type === 'assistant'
  const displayContent = interpretation
    ? formatInterpretation(interpretation)
    : content || '';

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <p className="text-text-primary text-sm whitespace-pre-wrap break-words">
          {displayContent}
        </p>
      </div>
    </div>
  );
}

