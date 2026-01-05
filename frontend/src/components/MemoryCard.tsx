/**
 * Card de memória individual
 * Representa uma entrada de memória do usuário de forma visual e confiável
 * Design iOS-like com informações contextuais
 */
import { ClipboardList, FileText, Bell, Sparkles } from 'lucide-react';
import type { MemoryEntry } from './MemoryTimeline';

interface MemoryCardProps {
  memory: MemoryEntry;
}

/**
 * Formata data de forma contextual
 * "Hoje", "Ontem", "Há X dias", ou data completa
 */
function formatContextualDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const memoryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffTime = today.getTime() - memoryDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoje';
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays < 7) {
    return `Há ${diffDays} dias`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`;
  } else {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }
}

/**
 * Obtém ícone e cor baseado no tipo de memória
 */
function getMemoryTypeInfo(memory: MemoryEntry) {
  if (memory.interpretation) {
    switch (memory.interpretation.action_type) {
      case 'task':
        return {
          Icon: ClipboardList,
          label: 'Tarefa',
          color: 'bg-blue-50 border-blue-200/50',
          dotColor: 'bg-blue-500',
        };
      case 'note':
        return {
          Icon: FileText,
          label: 'Nota',
          color: 'bg-green-50 border-green-200/50',
          dotColor: 'bg-green-500',
        };
      case 'reminder':
        return {
          Icon: Bell,
          label: 'Lembrete',
          color: 'bg-purple-50 border-purple-200/50',
          dotColor: 'bg-purple-500',
        };
      default:
        return {
          Icon: Sparkles,
          label: 'Pensamento',
          color: 'bg-gray-50 border-gray-200/50',
          dotColor: 'bg-gray-400',
        };
    }
  }

  // Memória simples (sem interpretação)
  return {
    Icon: Sparkles,
    label: 'Pensamento',
    color: 'bg-gray-50 border-gray-200/50',
    dotColor: 'bg-gray-400',
  };
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const typeInfo = getMemoryTypeInfo(memory);
  const { Icon } = typeInfo;
  const timeStr = memory.timestamp
    ? memory.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '';
  const dateStr = memory.timestamp ? formatContextualDate(memory.timestamp) : '';

  // Apenas renderizar cards para entradas do usuário
  if (memory.type !== 'user') {
    return null;
  }

  return (
    <div
      className={`border rounded-xl p-3 transition-all hover:shadow-sm ${typeInfo.color} opacity-75`}
    >
      <div className="flex items-start gap-2.5">
        {/* Indicador visual lateral - mais sutil */}
        <div className={`flex-shrink-0 w-0.5 h-10 rounded-full ${typeInfo.dotColor} opacity-40`} />
        
        <div className="flex-1 min-w-0">
          {/* Header com tipo e data - mais discreto */}
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className="w-3.5 h-3.5 text-text-secondary/40" strokeWidth={2} />
            <span className="text-xs text-text-secondary/50" style={{ fontWeight: 400 }}>
              {typeInfo.label}
            </span>
            {dateStr && (
              <>
                <span className="text-text-secondary/30">·</span>
                <span className="text-xs text-text-secondary/50">{dateStr}</span>
                {timeStr && (
                  <span className="text-xs text-text-secondary/40 ml-1">{timeStr}</span>
                )}
              </>
            )}
          </div>

          {/* Conteúdo - menor contraste */}
          {memory.content && (
            <p className="text-text-primary/70 text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ fontWeight: 400 }}>
              {memory.content}
            </p>
          )}

          {/* Status de confirmação se necessário */}
          {memory.needsConfirmation && (
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-text-secondary/70">Aguardando</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

