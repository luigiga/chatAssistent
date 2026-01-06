/**
 * Card de memória para a lista de memórias
 * Visual iOS-like, limpo e organizado - Resumo premium, não nota crua
 */
import { motion } from 'framer-motion';
import { ClipboardList, FileText, Bell, Sparkles } from 'lucide-react';
import type { MemoryInterpretationResponse } from '../services/api';
import type { MemoryEntry } from './MemoryTimeline';
import { useMemoryMetadata } from '../hooks/useMemoryMetadata';

interface MemoryListCardProps {
  memory: MemoryEntry;
  isNew?: boolean; // Indica se é uma memória recém-criada
  onClick?: (memory: MemoryEntry) => void;
}

function getTypeInfo(interpretation: MemoryInterpretationResponse['interpretation']) {
  switch (interpretation.action_type) {
    case 'task':
      return {
        label: 'Tarefa',
        Icon: ClipboardList,
        color: 'bg-blue-50/20 border-blue-200/30',
        iconColor: 'text-blue-primary',
        lineColor: 'bg-blue-primary',
      };
    case 'note':
      return {
        label: 'Nota',
        Icon: FileText,
        color: 'bg-green-50/20 border-green-200/30',
        iconColor: 'text-green-600',
        lineColor: 'bg-green-600',
      };
    case 'reminder':
      return {
        label: 'Lembrete',
        Icon: Bell,
        color: 'bg-purple-50/20 border-purple-200/30',
        iconColor: 'text-orange-500',
        lineColor: 'bg-orange-500',
      };
    default:
      return {
        label: 'Pensamento',
        Icon: Sparkles,
        color: 'bg-gray-50/20 border-gray-200/30',
        iconColor: 'text-blue-primary',
        lineColor: 'bg-blue-primary',
      };
  }
}

function getContent(interpretation: MemoryInterpretationResponse['interpretation']) {
  if (interpretation.task) {
    return {
      title: interpretation.task.title,
      body: interpretation.task.description,
    };
  }
  if (interpretation.note) {
    return {
      title: interpretation.note.title || interpretation.note.content,
      body: interpretation.note.title ? interpretation.note.content : undefined,
    };
  }
  if (interpretation.reminder) {
    return {
      title: interpretation.reminder.title,
      body: interpretation.reminder.description,
    };
  }
  return {
    title: 'Registro',
    body: undefined,
  };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function MemoryListCard({ memory, isNew = false, onClick }: MemoryListCardProps) {
  const { getMetadata } = useMemoryMetadata();

  if (!memory.interpretation) {
    return null;
  }

  const typeInfo = getTypeInfo(memory.interpretation);
  const content = getContent(memory.interpretation);
  const timeStr = memory.timestamp ? formatTime(memory.timestamp) : '';
  const metadata = getMetadata(memory.id);
  const observationsCount = metadata?.observations?.length || 0;

  const handleClick = () => {
    if (onClick) {
      onClick(memory);
    }
  };

  const CardContent = (
    <>
      {/* Acento mínimo - linha lateral MUITO sutil */}
      <div
        className={`absolute top-0 left-0 w-0.5 h-full ${typeInfo.lineColor} opacity-15`}
        style={{ borderRadius: '12px 0 0 12px' }}
      />

      <div className="pl-6">
        {/* Título - protagonista */}
        <h3
          className="text-lg text-text-primary dark:text-text-primary-dark break-words leading-relaxed mb-4"
          style={{ fontWeight: 500, letterSpacing: '-0.01em' }}
        >
          {content.title}
        </h3>

        {/* Preview - sussurro */}
        {content.body && (
          <p
            className="text-sm text-text-secondary/30 dark:text-text-secondary-dark/30 break-words leading-relaxed mb-6 line-clamp-1"
            style={{ fontWeight: 400 }}
          >
            {content.body}
          </p>
        )}

        {/* Metadados - quase invisíveis */}
        <div className="flex items-center gap-3 flex-wrap">
          {timeStr && (
            <span
              className="text-[11px] text-text-secondary/20 dark:text-text-secondary-dark/20"
              style={{ fontWeight: 400, letterSpacing: '0.02em' }}
            >
              {timeStr}
            </span>
          )}

          {/* Indicador de profundidade - elegante */}
          {observationsCount > 0 && (
            <div className="flex items-center gap-1.5">
              {/* Mini stack visual */}
              <div className="flex items-end gap-0.5">
                <div className="w-1 h-1 rounded-full bg-text-secondary/25 dark:bg-text-secondary-dark/25" />
                <div className="w-1 h-1.5 rounded-full bg-text-secondary/30 dark:bg-text-secondary-dark/30" />
                <div className="w-1 h-2 rounded-full bg-text-secondary/35 dark:bg-text-secondary-dark/35" />
              </div>
              {/* Texto elegante */}
              <span
                className="text-[11px] text-text-secondary/35 dark:text-text-secondary-dark/35"
                style={{ fontWeight: 400, letterSpacing: '0.02em' }}
              >
                {observationsCount} {observationsCount === 1 ? 'camada' : 'camadas'}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={handleClick}
        className={`relative border rounded-3xl p-10 transition-all bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm border-border/20 dark:border-border-dark/20 ${isNew ? 'animate-memory-appear' : ''} overflow-hidden w-full text-left hover:opacity-95`}
        style={{
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        }}
        whileTap={{ scale: 0.99 }}
        whileHover={{ scale: 0.995 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {CardContent}
      </motion.button>
    );
  }

  return (
    <div
      className={`relative border rounded-3xl p-10 transition-all bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm border-border/20 dark:border-border-dark/20 ${isNew ? 'animate-memory-appear' : ''} overflow-hidden`}
      style={{
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
      }}
    >
      {CardContent}
    </div>
  );
}
