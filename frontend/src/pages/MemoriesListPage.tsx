/**
 * Tela de Memórias - Lista Organizada
 * Design iOS + Magic UI - Visual suave e organizado
 */
import { useMemo, useRef, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import type { MemoryEntry } from '../components/MemoryTimeline';
import { MemoryListCard } from '../components/MemoryListCard';
import { MemoriesEmptyState } from '../components/MemoriesEmptyState';

interface MemoriesListPageProps {
  memories: MemoryEntry[];
}

function groupMemoriesByPeriod(memories: MemoryEntry[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const groups: Array<{ period: string; memories: MemoryEntry[] }> = [];
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

export function MemoriesListPage({ memories }: MemoriesListPageProps) {
  const actionMemories = useMemo(() => {
    return memories.filter((m) => m.type === 'assistant' && m.interpretation);
  }, [memories]);

  const groupedMemories = useMemo(() => {
    return groupMemoriesByPeriod(actionMemories);
  }, [actionMemories]);

  const previousMemoryIdsRef = useRef<Set<string>>(new Set());
  const newMemoryIdsRef = useRef<Set<string>>(new Set());
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    const currentIds = new Set(actionMemories.map((m) => m.id));
    const previousIds = previousMemoryIdsRef.current;

    if (isInitialMountRef.current) {
      previousMemoryIdsRef.current = currentIds;
      isInitialMountRef.current = false;
      return;
    }

    const newIds = new Set<string>();
    currentIds.forEach((id) => {
      if (!previousIds.has(id)) {
        newIds.add(id);
      }
    });

    previousMemoryIdsRef.current = currentIds;
    newMemoryIdsRef.current = newIds;

    if (newIds.size > 0) {
      const timeout = setTimeout(() => {
        newMemoryIdsRef.current.clear();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [actionMemories]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
      {/* Header com glassmorphism */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="px-6 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Título e contador */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary mb-1">
                  Memórias
                </h1>
                <p className="text-sm text-text-secondary/60">
                  {actionMemories.length} {actionMemories.length === 1 ? 'registro' : 'registros'} organizados
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Botão de busca */}
                <button className="p-3 bg-white rounded-2xl border border-gray-200/50 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                  <Search className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                </button>
                {/* Botão de filtro */}
                <button className="p-3 bg-white rounded-2xl border border-gray-200/50 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                  <Filter className="w-5 h-5 text-text-secondary" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Stats cards - iOS style */}
            {actionMemories.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/30">
                  <p className="text-2xl font-semibold text-blue-600 mb-1">
                    {actionMemories.filter(m => m.interpretation?.action_type === 'task').length}
                  </p>
                  <p className="text-xs text-blue-600/70 font-medium">Tarefas</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/30">
                  <p className="text-2xl font-semibold text-green-600 mb-1">
                    {actionMemories.filter(m => m.interpretation?.action_type === 'note').length}
                  </p>
                  <p className="text-xs text-green-600/70 font-medium">Notas</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/30">
                  <p className="text-2xl font-semibold text-purple-600 mb-1">
                    {actionMemories.filter(m => m.interpretation?.action_type === 'reminder').length}
                  </p>
                  <p className="text-xs text-purple-600/70 font-medium">Lembretes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo com scroll */}
      <div className="flex-1 overflow-y-auto">
        {actionMemories.length === 0 ? (
          <MemoriesEmptyState />
        ) : (
          <div className="px-6 py-8">
            <div className="max-w-3xl mx-auto space-y-12">
              {groupedMemories.map((group) => (
                <div key={group.period} className="space-y-4">
                  {/* Header do período com glassmorphism */}
                  <div className="sticky top-0 z-10 py-3 -mx-2 px-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-full border border-gray-200/50 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      <h2 className="text-sm font-semibold text-text-primary">
                        {group.period}
                      </h2>
                      <span className="text-xs text-text-secondary/60">
                        {group.memories.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards de memória com espaçamento generoso */}
                  <div className="space-y-3">
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

              {/* Footer motivacional */}
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-gray-200/30">
                  <Sparkles className="w-4 h-4 text-blue-500" strokeWidth={2} />
                  <p className="text-sm text-text-secondary/70">
                    Todas as memórias organizadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
