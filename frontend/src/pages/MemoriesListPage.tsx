/**
 * Página de Lista de Memórias - Biblioteca Silenciosa
 * Extensão visual da memória do usuário - organização, calma e clareza
 * Modelo de Memory Spaces com navegação local
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, CalendarDays, Lightbulb, Repeat, Archive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MemoryEntry, ExtendedMemoryEntry } from '../components/MemoryTimeline';
import { MemorySpaceCard, type MemorySpaceKey } from '../components/MemorySpaceCard';
import { MemorySpaceDetail } from '../components/MemorySpaceDetail';
import { MemoriesEmptyState } from '../components/MemoriesEmptyState';
import { MemoryDetailSheet } from '../components/memories/MemoryDetailSheet';
import type { MemoryFilters } from '../components/memories/types';
import { useMemoryMetadata } from '../hooks/useMemoryMetadata';

interface MemoriesListPageProps {
  memories: MemoryEntry[];
}

interface MemorySpace {
  spaceId: MemorySpaceKey;
  title: string;
  icon: LucideIcon;
  memories: MemoryEntry[];
  preview?: string;
}

/**
 * Palavras-chave para detectar ideias
 */
const IDEA_KEYWORDS = ['ideia', 'projeto', 'talvez', 'pensar', 'criar'];

/**
 * Palavras-chave para detectar rotina
 */
const ROUTINE_KEYWORDS = ['todo dia', 'diário', 'rotina', 'tomar água', 'sempre', 'todos os dias'];

/**
 * Verifica se uma memória pertence ao espaço "Hoje"
 */
function isToday(memory: MemoryEntry): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const memoryDate = new Date(
    memory.timestamp.getFullYear(),
    memory.timestamp.getMonth(),
    memory.timestamp.getDate(),
  );

  // Verifica se foi criada hoje
  if (memoryDate.getTime() === today.getTime()) {
    return true;
  }

  // Verifica se tem due_date hoje
  if (memory.interpretation?.task?.due_date) {
    const dueDate = new Date(memory.interpretation.task.due_date);
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    if (dueDateOnly.getTime() === today.getTime()) {
      return true;
    }
  }

  return false;
}

/**
 * Verifica se uma memória pertence ao espaço "Esta semana"
 */
function isThisWeek(memory: MemoryEntry): boolean {
  if (isToday(memory)) {
    return false; // Hoje tem prioridade
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const memoryDate = new Date(
    memory.timestamp.getFullYear(),
    memory.timestamp.getMonth(),
    memory.timestamp.getDate(),
  );

  return memoryDate >= weekAgo;
}

/**
 * Verifica se uma memória pertence ao espaço "Ideias"
 */
function isIdea(memory: MemoryEntry): boolean {
  // Verifica action_type (não existe 'idea' no tipo atual, mas podemos verificar conteúdo)
  const content = memory.content?.toLowerCase() || '';
  const interpretationContent =
    memory.interpretation?.note?.content?.toLowerCase() ||
    memory.interpretation?.task?.title?.toLowerCase() ||
    memory.interpretation?.reminder?.title?.toLowerCase() ||
    '';

  const fullContent = `${content} ${interpretationContent}`;

  return IDEA_KEYWORDS.some((keyword) => fullContent.includes(keyword));
}

/**
 * Verifica se uma memória pertence ao espaço "Rotina"
 */
function isRoutine(memory: MemoryEntry): boolean {
  // Verifica action_type (não existe 'habit' no tipo atual, mas podemos verificar conteúdo)
  const content = memory.content?.toLowerCase() || '';
  const interpretationContent =
    memory.interpretation?.note?.content?.toLowerCase() ||
    memory.interpretation?.task?.title?.toLowerCase() ||
    memory.interpretation?.reminder?.title?.toLowerCase() ||
    '';

  const fullContent = `${content} ${interpretationContent}`;

  return ROUTINE_KEYWORDS.some((keyword) => fullContent.includes(keyword));
}

/**
 * Extrai preview de uma memória (primeira linha do conteúdo)
 */
function getMemoryPreview(memory: MemoryEntry): string | undefined {
  if (memory.interpretation) {
    if (memory.interpretation.task?.title) {
      return memory.interpretation.task.title;
    }
    if (memory.interpretation.note?.title) {
      return memory.interpretation.note.title;
    }
    if (memory.interpretation.note?.content) {
      return memory.interpretation.note.content.split('\n')[0].substring(0, 60);
    }
    if (memory.interpretation.reminder?.title) {
      return memory.interpretation.reminder.title;
    }
  }
  if (memory.content) {
    return memory.content.split('\n')[0].substring(0, 60);
  }
  return undefined;
}

/**
 * Agrupa memórias em Memory Spaces com prioridades
 * Prioridade: Hoje > Esta semana > Rotina > Ideias > Mais antigas
 */
function groupMemoriesIntoSpaces(memories: MemoryEntry[]): MemorySpace[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const spaces: MemorySpace[] = [
    { spaceId: 'today', title: 'Hoje', icon: Calendar, memories: [] },
    { spaceId: 'thisWeek', title: 'Esta semana', icon: CalendarDays, memories: [] },
    { spaceId: 'routine', title: 'Rotina', icon: Repeat, memories: [] },
    { spaceId: 'ideas', title: 'Ideias', icon: Lightbulb, memories: [] },
    { spaceId: 'older', title: 'Mais antigas', icon: Archive, memories: [] },
  ];

  // Ordenar memórias por data (mais recente primeiro)
  const sorted = [...memories].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  sorted.forEach((memory) => {
    // Aplicar prioridades em ordem
    if (isToday(memory)) {
      spaces[0].memories.push(memory);
    } else if (isThisWeek(memory)) {
      spaces[1].memories.push(memory);
    } else if (isRoutine(memory)) {
      spaces[2].memories.push(memory);
    } else if (isIdea(memory)) {
      spaces[3].memories.push(memory);
    } else {
      spaces[4].memories.push(memory);
    }
  });

  // Adicionar preview para cada espaço (primeira memória)
  spaces.forEach((space) => {
    if (space.memories.length > 0) {
      space.preview = getMemoryPreview(space.memories[0]);
    }
  });

  return spaces;
}

export function MemoriesListPage({ memories }: MemoriesListPageProps) {
  const { updateMetadata } = useMemoryMetadata();

  // Filtrar apenas memórias do assistente (ações registradas)
  const actionMemories = useMemo(() => {
    return memories.filter((m) => m.type === 'assistant' && m.interpretation);
  }, [memories]);

  // Estado de navegação local
  const [activeSpace, setActiveSpace] = useState<MemorySpaceKey | null>(null);

  // Estado para MemoryDetailSheet
  const [selectedMemory, setSelectedMemory] = useState<ExtendedMemoryEntry | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  // Estado para FilterSheet
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<MemoryFilters>({});

  // Agrupar memórias em espaços
  const memorySpaces = useMemo(() => {
    return groupMemoriesIntoSpaces(actionMemories);
  }, [actionMemories]);

  // Encontrar o espaço ativo
  const activeSpaceData = useMemo(() => {
    if (activeSpace === null) return null;
    return memorySpaces.find((space) => space.spaceId === activeSpace) || null;
  }, [activeSpace, memorySpaces]);

  // Handler para clique em memória
  const handleMemoryClick = (memory: MemoryEntry) => {
    setSelectedMemory(memory as ExtendedMemoryEntry);
    setDetailSheetOpen(true);
  };

  // Handler para atualizar memória
  const handleMemoryUpdate = (
    memoryId: string,
    updates: Partial<{ category?: string; title?: string; body?: string }>,
  ) => {
    // Atualizar metadados via hook
    if (updates.category !== undefined) {
      updateMetadata(memoryId, { category: updates.category });
    }
    // Nota: title e body não são salvos no backend ainda, apenas localmente via metadados
    // Isso pode ser estendido no futuro para salvar no backend
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background dark:bg-background-dark">
      <AnimatePresence mode="wait">
        {activeSpace === null ? (
          // Tela raiz: Biblioteca Silenciosa
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 overflow-y-auto pb-24 bg-gradient-to-b from-background via-background to-background/95 dark:from-background-dark dark:via-background-dark dark:to-background-dark/95"
          >
            {/* Header emocional centralizado */}
            <div className="px-4 py-24 flex flex-col items-center justify-center text-center">
              {/* Ícone do Lumeo - mais sutil e contemplativo */}
              <div className="w-16 h-16 bg-blue-primary/3 dark:bg-blue-primary/8 rounded-full flex items-center justify-center mb-5">
                <Sparkles
                  className="w-8 h-8 text-blue-primary/12 dark:text-blue-primary/25"
                  strokeWidth={1.5}
                />
              </div>

              <h1
                className="text-2xl text-text-primary dark:text-text-primary-dark mb-2 leading-relaxed"
                style={{ fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                Suas Memórias
              </h1>
              <p
                className="text-sm text-text-secondary/40 dark:text-text-secondary-dark/40 leading-relaxed max-w-xs mx-auto"
                style={{ letterSpacing: '0.01em', fontWeight: 400 }}
              >
                Um lugar seguro para tudo o que você confia ao Lumeo.
              </p>
            </div>

            {/* Memory Spaces */}
            {actionMemories.length === 0 ? (
              <MemoriesEmptyState
                memorySpaces={memorySpaces}
                onSpaceClick={(spaceId) => setActiveSpace(spaceId)}
              />
            ) : (
              <div className="px-4 pb-12">
                {/* Pausa visual antes do conteúdo */}
                <div className="max-w-md mx-auto pt-12">
                  <div className="space-y-8">
                    {memorySpaces.map((space) => (
                      <MemorySpaceCard
                        key={space.spaceId}
                        spaceId={space.spaceId}
                        title={space.title}
                        icon={space.icon}
                        count={space.memories.length}
                        preview={space.preview}
                        isEmpty={space.memories.length === 0}
                        onClick={() => {
                          if (space.memories.length > 0) {
                            setActiveSpace(space.spaceId);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          // Sub-tela: Detalhes do espaço
          activeSpaceData && (
            <MemorySpaceDetail
              key={activeSpace}
              spaceId={activeSpaceData.spaceId}
              title={activeSpaceData.title}
              memories={activeSpaceData.memories}
              onBack={() => setActiveSpace(null)}
              onMemoryClick={handleMemoryClick}
              filterSheetOpen={filterSheetOpen}
              onFilterSheetOpenChange={setFilterSheetOpen}
              filters={filters}
              onFiltersChange={setFilters}
            />
          )
        )}
      </AnimatePresence>

      {/* MemoryDetailSheet */}
      <MemoryDetailSheet
        memory={selectedMemory}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onUpdate={handleMemoryUpdate}
      />
    </div>
  );
}
