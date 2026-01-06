/**
 * Sub-tela de detalhes de um Memory Space
 * Mostra lista de memórias de um espaço específico
 * Reutiliza MemoryListCard existente
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import type { MemoryEntry } from './MemoryTimeline';
import { MemoryListCard } from './MemoryListCard';
import type { MemorySpaceKey } from './MemorySpaceCard';
import { FilterSheet } from './memories/FilterSheet';
import type { MemoryFilters } from './memories/types';
import { useMemoryMetadata } from '../hooks/useMemoryMetadata';

/**
 * Agrupa memórias por período de tempo para visualização de acervo
 */
function groupMemoriesByTime(memories: MemoryEntry[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const groups: Array<{ period: string; memories: MemoryEntry[] }> = [];
  const todayMemories: MemoryEntry[] = [];
  const yesterdayMemories: MemoryEntry[] = [];
  const thisWeekMemories: MemoryEntry[] = [];
  const thisMonthMemories: MemoryEntry[] = [];
  const olderMemories: MemoryEntry[] = [];

  memories.forEach((memory) => {
    const memoryDate = new Date(
      memory.timestamp.getFullYear(),
      memory.timestamp.getMonth(),
      memory.timestamp.getDate()
    );

    if (memoryDate.getTime() === today.getTime()) {
      todayMemories.push(memory);
    } else if (memoryDate.getTime() === yesterday.getTime()) {
      yesterdayMemories.push(memory);
    } else if (memoryDate >= weekAgo) {
      thisWeekMemories.push(memory);
    } else if (memoryDate >= monthAgo) {
      thisMonthMemories.push(memory);
    } else {
      olderMemories.push(memory);
    }
  });

  if (todayMemories.length > 0) groups.push({ period: 'Hoje', memories: todayMemories });
  if (yesterdayMemories.length > 0) groups.push({ period: 'Ontem', memories: yesterdayMemories });
  if (thisWeekMemories.length > 0) groups.push({ period: 'Esta semana', memories: thisWeekMemories });
  if (thisMonthMemories.length > 0) groups.push({ period: 'Este mês', memories: thisMonthMemories });
  if (olderMemories.length > 0) groups.push({ period: 'Mais antigas', memories: olderMemories });

  return groups;
}

interface MemorySpaceDetailProps {
  spaceId: MemorySpaceKey;
  title: string;
  memories: MemoryEntry[];
  onBack: () => void;
  onMemoryClick?: (memory: MemoryEntry) => void;
  filterSheetOpen?: boolean;
  onFilterSheetOpenChange?: (open: boolean) => void;
  filters?: MemoryFilters;
  onFiltersChange?: (filters: MemoryFilters) => void;
}

export function MemorySpaceDetail({
  spaceId,
  title,
  memories,
  onBack,
  onMemoryClick,
  filterSheetOpen = false,
  onFilterSheetOpenChange,
  filters = {},
  onFiltersChange,
}: MemorySpaceDetailProps) {
  const { getMetadata } = useMemoryMetadata();

  // Aplicar filtros
  const filteredMemories = useMemo(() => {
    let filtered = [...memories];

    // Filtrar por categoria
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((memory) => {
        const metadata = getMetadata(memory.id);
        return metadata?.category && filters.categories?.includes(metadata.category);
      });
    }

    // Filtrar por tipo
    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter((memory) => {
        const actionType = memory.interpretation?.action_type;
        return actionType && filters.types?.includes(actionType);
      });
    }

    // Filtrar por observações
    if (filters.hasObservations) {
      filtered = filtered.filter((memory) => {
        const metadata = getMetadata(memory.id);
        return metadata?.observations && metadata.observations.length > 0;
      });
    }

    // Ordenar
    if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } else {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return filtered;
  }, [memories, filters, getMetadata]);

  // Agrupar memórias filtradas por tempo para visualização de acervo
  const groupedMemories = useMemo(() => {
    return groupMemoriesByTime(filteredMemories);
  }, [filteredMemories]);

  return (
    <>
      <motion.div
        key={spaceId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Header ainda mais simples - apenas ícone de voltar */}
        <header className="px-4 py-4 border-b border-border/20 dark:border-border-dark/20 bg-white/60 dark:bg-surface-dark/60 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <motion.button
              onClick={onBack}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
              aria-label="Voltar"
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary/60 dark:text-text-secondary-dark/60" strokeWidth={2} />
            </motion.button>
            <h1 className="flex-1 text-center text-base text-text-primary dark:text-text-primary-dark" style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>
              {title}
            </h1>
            {/* Ícone de filtros */}
            {onFilterSheetOpenChange && (
              <motion.button
                onClick={() => onFilterSheetOpenChange(true)}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                aria-label="Filtros"
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <SlidersHorizontal className="w-5 h-5 text-text-secondary/60 dark:text-text-secondary-dark/60" strokeWidth={2} />
              </motion.button>
            )}
          </div>
        </header>

        {/* Lista de memórias - Acervo/Biblioteca */}
        <div className="flex-1 overflow-y-auto pb-24 bg-background dark:bg-background-dark">
          {filteredMemories.length === 0 ? (
            <div className="flex items-center justify-center min-h-[40vh] px-4">
              <p className="text-sm text-text-secondary/50 dark:text-text-secondary-dark/50 text-center">
                {memories.length === 0
                  ? 'Nenhuma memória neste espaço ainda.'
                  : 'Nenhuma memória corresponde aos filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="px-4 py-8">
              <div className="max-w-4xl mx-auto">
                {groupedMemories.map((group) => (
                  <div key={group.period} className="mb-12">
                    {/* Cabeçalho discreto */}
                    <h2 className="text-xs text-text-secondary/40 dark:text-text-secondary-dark/40 mb-6 font-medium uppercase tracking-wider">
                      {group.period}
                    </h2>
                    
                    {/* Grid responsivo - acervo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {group.memories.map((memory) => (
                        <MemoryListCard 
                          key={memory.id} 
                          memory={memory} 
                          onClick={onMemoryClick}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* FilterSheet */}
      {onFilterSheetOpenChange && onFiltersChange && (
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={onFilterSheetOpenChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      )}
    </>
  );
}

