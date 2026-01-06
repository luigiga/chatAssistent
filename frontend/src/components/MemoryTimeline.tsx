/**
 * Container principal de memórias com scroll
 * Timeline de registros agrupados por período
 */
import { useEffect, useRef, useMemo } from 'react';
import { MessageBubble, type MemoryEntryType } from './MessageBubble';
import { MemoryCard } from './MemoryCard';
import { EmptyState } from './EmptyState';
import type { MemoryInterpretationResponse } from '../services/api';

export type MemoryCategory = 'Pessoal' | 'Trabalho' | 'Saúde' | 'Finanças' | 'Ideias' | 'Rotina';

export interface MemoryObservation {
  id: string;
  text: string;
  createdAt: Date;
}

export interface MemoryMetadata {
  category?: MemoryCategory | string;
  observations?: MemoryObservation[];
  isFavorite?: boolean;
}

export interface MemoryEntry {
  id: string;
  type: MemoryEntryType;
  content?: string;
  interpretation?: MemoryInterpretationResponse['interpretation'];
  interactionId?: string;
  needsConfirmation?: boolean;
  timestamp: Date;
  metadata?: MemoryMetadata;
}

// Estender MemoryEntry para compatibilidade com metadados
export interface ExtendedMemoryEntry extends MemoryEntry {
  metadata?: MemoryMetadata;
}

interface MemoryTimelineProps {
  memories: MemoryEntry[];
  onConfirm?: (interactionId: string) => void;
  onReject?: (interactionId: string) => void;
  confirmingIds?: Set<string>;
  onSuggestionClick?: (text: string) => void;
}

/**
 * Agrupa memórias por período (Hoje, Ontem, Esta Semana, etc.)
 */
function groupMemoriesByPeriod(memories: MemoryEntry[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Domingo da semana atual
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const groups: Array<{ period: string; memories: MemoryEntry[] }> = [];

  // Ordenar memórias por data (mais recente primeiro)
  const sorted = [...memories].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const todayMemories: MemoryEntry[] = [];
  const yesterdayMemories: MemoryEntry[] = [];
  const thisWeekMemories: MemoryEntry[] = [];
  const lastWeekMemories: MemoryEntry[] = [];
  const olderMemories: MemoryEntry[] = [];

  sorted.forEach((memory) => {
    const memoryDate = new Date(
      memory.timestamp.getFullYear(),
      memory.timestamp.getMonth(),
      memory.timestamp.getDate(),
    );

    if (memoryDate.getTime() === today.getTime()) {
      todayMemories.push(memory);
    } else if (memoryDate.getTime() === yesterday.getTime()) {
      yesterdayMemories.push(memory);
    } else if (memoryDate >= weekStart) {
      thisWeekMemories.push(memory);
    } else if (memoryDate >= lastWeekStart) {
      lastWeekMemories.push(memory);
    } else {
      olderMemories.push(memory);
    }
  });

  if (todayMemories.length > 0) {
    groups.push({ period: 'Hoje', memories: todayMemories });
  }
  if (yesterdayMemories.length > 0) {
    groups.push({ period: 'Ontem', memories: yesterdayMemories });
  }
  if (thisWeekMemories.length > 0) {
    groups.push({ period: 'Esta semana', memories: thisWeekMemories });
  }
  if (lastWeekMemories.length > 0) {
    groups.push({ period: 'Semana passada', memories: lastWeekMemories });
  }
  if (olderMemories.length > 0) {
    // Agrupar memórias antigas por mês
    const byMonth = new Map<string, MemoryEntry[]>();
    olderMemories.forEach((memory) => {
      const monthKey = memory.timestamp.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      });
      if (!byMonth.has(monthKey)) {
        byMonth.set(monthKey, []);
      }
      byMonth.get(monthKey)!.push(memory);
    });

    byMonth.forEach((monthMemories, monthKey) => {
      groups.push({ period: monthKey, memories: monthMemories });
    });
  }

  return groups;
}

export function MemoryTimeline({
  memories,
  onConfirm,
  onReject,
  confirmingIds,
  onSuggestionClick,
}: MemoryTimelineProps) {
  const memoriesEndRef = useRef<HTMLDivElement>(null);

  // Agrupar memórias por período
  const groupedMemories = useMemo(() => groupMemoriesByPeriod(memories), [memories]);

  useEffect(() => {
    // Scroll automático para a última entrada
    memoriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [memories]);

  return (
    <div className="px-4 py-6 pb-6 bg-background dark:bg-background-dark">
      <div className="max-w-md mx-auto">
        {memories.length === 0 ? (
          <EmptyState onSuggestionClick={onSuggestionClick} />
        ) : (
          <div className="space-y-8">
            {groupedMemories.map((group) => (
              <div key={group.period} className="space-y-4">
                {/* Header do período */}
                <div className="sticky top-0 bg-background/95 dark:bg-background-dark/95 backdrop-blur-sm z-10 py-3 -mt-2 mb-1">
                  <h2
                    className="text-xs text-text-secondary dark:text-text-secondary-dark"
                    style={{ fontWeight: 500 }}
                  >
                    {group.period}
                  </h2>
                </div>

                {/* Memórias do período */}
                <div className="space-y-4">
                  {group.memories.map((memory, index, array) => {
                    // Verificar se há uma resposta do assistente logo após esta entrada do usuário
                    const hasFollowingAction =
                      memory.type === 'user' &&
                      array[index + 1]?.type === 'assistant' &&
                      array[index + 1]?.interpretation;

                    // Para entradas do usuário: ocultar completamente quando há ação gerada
                    if (memory.type === 'user') {
                      if (hasFollowingAction) {
                        // Ocultar pensamento original quando há ação gerada
                        // O card de ação é o elemento principal e mostrará o texto original colapsado
                        return null;
                      }
                      // Apenas mostrar pensamento original se não houver ação gerada
                      return (
                        <div key={memory.id}>
                          <MemoryCard memory={memory} />
                        </div>
                      );
                    }

                    // Para respostas do assistente: verificar se há entrada do usuário anterior
                    if (memory.type === 'assistant' && memory.interpretation) {
                      const previousUserEntry =
                        array[index - 1]?.type === 'user' ? array[index - 1] : null;
                      const originalText = previousUserEntry?.content;

                      return (
                        <div key={memory.id}>
                          <MessageBubble
                            type={memory.type}
                            content={memory.content}
                            interpretation={memory.interpretation}
                            originalText={originalText}
                            interactionId={memory.interactionId}
                            needsConfirmation={memory.needsConfirmation}
                            onConfirm={onConfirm}
                            onReject={onReject}
                            isConfirming={
                              memory.interactionId
                                ? confirmingIds?.has(memory.interactionId)
                                : false
                            }
                            timestamp={memory.timestamp}
                          />
                        </div>
                      );
                    }

                    // Para outros tipos (loading, error), usar MessageBubble
                    // Apenas mostrar se não for uma confirmação silenciosa muito curta
                    const isShortConfirmation =
                      memory.type === 'assistant' &&
                      !memory.interpretation &&
                      memory.content &&
                      memory.content.length < 30;

                    if (isShortConfirmation) {
                      // Confirmações muito curtas não são exibidas
                      return null;
                    }

                    return (
                      <div key={memory.id}>
                        <MessageBubble
                          type={memory.type}
                          content={memory.content}
                          interpretation={memory.interpretation}
                          interactionId={memory.interactionId}
                          needsConfirmation={memory.needsConfirmation}
                          onConfirm={onConfirm}
                          onReject={onReject}
                          isConfirming={
                            memory.interactionId ? confirmingIds?.has(memory.interactionId) : false
                          }
                          timestamp={memory.timestamp}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={memoriesEndRef} />
      </div>
    </div>
  );
}
