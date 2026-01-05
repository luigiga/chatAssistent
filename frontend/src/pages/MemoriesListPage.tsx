/**
 * Página de Lista de Memórias
 * Extensão visual da memória do usuário - organização, calma e clareza
 */
import { useMemo, useRef, useEffect } from 'react';
import type { MemoryEntry } from '../components/MemoryTimeline';
import { MemoryListCard } from '../components/MemoryListCard';
import { MemoriesEmptyState } from '../components/MemoriesEmptyState';

interface MemoriesListPageProps {
  memories: MemoryEntry[];
}

/**
 * Agrupa memórias por período simplificado para a aba Memórias
 */
function groupMemoriesByPeriod(memories: MemoryEntry[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Domingo da semana atual

  const groups: Array<{ period: string; memories: MemoryEntry[] }> = [];

  // Ordenar memórias por data (mais recente primeiro)
  const sorted = [...memories].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const todayMemories: MemoryEntry[] = [];
  const thisWeekMemories: MemoryEntry[] = [];
  const olderMemories: MemoryEntry[] = [];

  sorted.forEach((memory) => {
    const memoryDate = new Date(
      memory.timestamp.getFullYear(),
      memory.timestamp.getMonth(),
      memory.timestamp.getDate(),
    );

    if (memoryDate.getTime() === today.getTime()) {
      todayMemories.push(memory);
    } else if (memoryDate >= weekStart) {
      thisWeekMemories.push(memory);
    } else {
      olderMemories.push(memory);
    }
  });

  if (todayMemories.length > 0) {
    groups.push({ period: 'Hoje', memories: todayMemories });
  }
  if (thisWeekMemories.length > 0) {
    groups.push({ period: 'Esta semana', memories: thisWeekMemories });
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

export function MemoriesListPage({
  memories,
}: MemoriesListPageProps) {
  // Filtrar apenas memórias do assistente (ações registradas)
  const actionMemories = useMemo(() => {
    return memories.filter((m) => m.type === 'assistant' && m.interpretation);
  }, [memories]);

  const groupedMemories = useMemo(() => {
    return groupMemoriesByPeriod(actionMemories);
  }, [actionMemories]);

  // Rastrear IDs de memórias para detectar novas
  const previousMemoryIdsRef = useRef<Set<string>>(new Set());
  const newMemoryIdsRef = useRef<Set<string>>(new Set());
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    const currentIds = new Set(actionMemories.map((m) => m.id));
    const previousIds = previousMemoryIdsRef.current;

    // Na primeira montagem, apenas inicializar sem animar
    if (isInitialMountRef.current) {
      previousMemoryIdsRef.current = currentIds;
      isInitialMountRef.current = false;
      return;
    }

    // Detectar novas memórias (presentes agora, mas não antes)
    const newIds = new Set<string>();
    currentIds.forEach((id) => {
      if (!previousIds.has(id)) {
        newIds.add(id);
      }
    });

    // Atualizar referências
    previousMemoryIdsRef.current = currentIds;
    newMemoryIdsRef.current = newIds;

    // Limpar flag de "nova" após a animação (500ms)
    if (newIds.size > 0) {
      const timeout = setTimeout(() => {
        newMemoryIdsRef.current.clear();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [actionMemories]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header acolhedor */}
      <div className="px-4 py-10 border-b border-border/15">
        <h1 className="text-2xl text-text-primary mb-2" style={{ fontWeight: 600 }}>
          Suas Memórias
        </h1>
        <p className="text-sm text-text-secondary/50 leading-relaxed">
          Um lugar seguro para tudo que você precisa lembrar.
        </p>
      </div>

      {/* Conteúdo organizado */}
      {actionMemories.length === 0 ? (
        <MemoriesEmptyState />
      ) : (
        <div className="px-4 py-10">
          <div className="max-w-2xl mx-auto space-y-14">
            {groupedMemories.map((group) => (
              <div key={group.period} className="space-y-5">
                {/* Header do período - sticky e suave */}
                <div className="sticky top-0 bg-background/98 backdrop-blur-sm z-10 py-5 -mt-2 mb-4">
                  <h2 className="text-xs text-text-secondary/50 uppercase tracking-wider" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                    {group.period}
                  </h2>
                </div>

                {/* Cards de memória - com respiro e animação */}
                <div className="space-y-4">
                  {group.memories.map((memory) => (
                    <MemoryListCard
                      key={memory.id}
                      memory={memory}
                      isNew={newMemoryIdsRef.current.has(memory.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

