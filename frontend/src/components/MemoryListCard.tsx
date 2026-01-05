/**
 * Card de memória para a lista de memórias
 * Visual iOS-like, limpo e organizado
 */
import { ClipboardList, FileText, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import type { MemoryInterpretationResponse } from '../services/api';
import type { MemoryEntry } from './MemoryTimeline';

interface MemoryListCardProps {
  memory: MemoryEntry;
  isNew?: boolean; // Indica se é uma memória recém-criada
}

function getTypeInfo(interpretation: MemoryInterpretationResponse['interpretation']) {
  switch (interpretation.action_type) {
    case 'task':
      return {
        label: 'Tarefa',
        Icon: ClipboardList,
        color: 'bg-blue-50/20 border-blue-200/30',
        iconColor: 'text-blue-primary/60',
      };
    case 'note':
      return {
        label: 'Nota',
        Icon: FileText,
        color: 'bg-green-50/20 border-green-200/30',
        iconColor: 'text-green-600/60',
      };
    case 'reminder':
      return {
        label: 'Lembrete',
        Icon: Bell,
        color: 'bg-purple-50/20 border-purple-200/30',
        iconColor: 'text-purple-600/60',
      };
    default:
      return {
        label: 'Pensamento',
        Icon: Sparkles,
        color: 'bg-gray-50/20 border-gray-200/30',
        iconColor: 'text-text-secondary/50',
      };
  }
}

function getContent(interpretation: MemoryInterpretationResponse['interpretation']) {
  if (interpretation.task) {
    return interpretation.task.title;
  }
  if (interpretation.note) {
    return interpretation.note.title || interpretation.note.content;
  }
  if (interpretation.reminder) {
    return interpretation.reminder.title;
  }
  return 'Registro';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function MemoryListCard({ memory, isNew = false }: MemoryListCardProps) {
  if (!memory.interpretation) {
    return null;
  }

  const typeInfo = getTypeInfo(memory.interpretation);
  const { Icon } = typeInfo;
  const content = getContent(memory.interpretation);
  const timeStr = memory.timestamp ? formatTime(memory.timestamp) : '';

  return (
    <div className={`border rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${typeInfo.color} ${isNew ? 'animate-memory-appear' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Ícone do tipo - muito discreto */}
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center border border-border/15">
          <Icon className={`w-4 h-4 ${typeInfo.iconColor} opacity-60`} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header com tipo e hora - extremamente discreto */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-text-secondary/40" style={{ fontWeight: 400 }}>
              {typeInfo.label}
            </span>
            {!memory.needsConfirmation && (
              <CheckCircle2 className="w-3 h-3 text-green-600/50" strokeWidth={2} />
            )}
            {timeStr && (
              <>
                <span className="text-text-secondary/25">·</span>
                <span className="text-xs text-text-secondary/40">{timeStr}</span>
              </>
            )}
          </div>

          {/* Conteúdo principal - hierarquia máxima, tipografia confortável */}
          <p className="text-text-primary text-base break-words leading-relaxed" style={{ fontWeight: 500 }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

