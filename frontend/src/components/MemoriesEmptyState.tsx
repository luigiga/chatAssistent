/**
 * Estado vazio da aba Memórias
 * Aconchegante, contemplativo e emocionalmente confortável
 * Mostra Memory Spaces "fantasmas" com textos acolhedores
 */
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { MemorySpaceCard, type MemorySpaceKey } from './MemorySpaceCard';
import { Calendar, CalendarDays, Lightbulb, Repeat, Archive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MemorySpace {
  spaceId: MemorySpaceKey;
  title: string;
  icon: LucideIcon;
  emptyText: string;
}

/**
 * Memory Spaces padrão com textos acolhedores
 */
const defaultSpaces: MemorySpace[] = [
  {
    spaceId: 'today',
    title: 'Hoje',
    icon: Calendar,
    emptyText: 'Suas memórias de hoje aparecerão aqui.',
  },
  {
    spaceId: 'thisWeek',
    title: 'Esta semana',
    icon: CalendarDays,
    emptyText: 'Memórias recentes encontram lugar aqui.',
  },
  {
    spaceId: 'ideas',
    title: 'Ideias',
    icon: Lightbulb,
    emptyText: 'Suas ideias e projetos ficam organizados aqui.',
  },
  {
    spaceId: 'routine',
    title: 'Rotina',
    icon: Repeat,
    emptyText: 'Hábitos e rotinas têm seu espaço dedicado.',
  },
  {
    spaceId: 'older',
    title: 'Mais antigas',
    icon: Archive,
    emptyText: 'Memórias mais antigas descansam aqui.',
  },
];

interface MemoriesEmptyStateProps {
  memorySpaces?: Array<{
    spaceId: MemorySpaceKey;
    title: string;
    icon: LucideIcon;
    memories: unknown[];
  }>;
  onSpaceClick?: (spaceId: MemorySpaceKey) => void;
}

export function MemoriesEmptyState({ memorySpaces, onSpaceClick }: MemoriesEmptyStateProps) {
  // Usar memorySpaces se fornecido, senão usar padrão
  const spaces = memorySpaces || defaultSpaces;

  // Selecionar uma frase aleatória para o header
  const headerPhrases = useMemo(() => {
    const phrases = [
      {
        primary: 'Aqui é onde seus pensamentos descansam.',
        secondary: 'Você não precisa organizar nada.',
      },
      {
        primary: 'Seu espaço de memórias está tranquilo.',
        secondary: 'Quando precisar, estaremos aqui.',
      },
      {
        primary: 'Tudo que você confiar ao Lumeo fica seguro.',
        secondary: 'Sem pressa, sem urgência.',
      },
      {
        primary: 'Um lugar para seus pensamentos.',
        secondary: 'Organizados, sem que você precise pensar nisso.',
      },
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        {/* Header centralizado */}
        <div className="text-center mb-8">
          {/* Ícone do Lumeo - mais sutil e contemplativo */}
          <div className="w-16 h-16 bg-blue-primary/3 dark:bg-blue-primary/8 rounded-full flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-blue-primary/12 dark:text-blue-primary/25" strokeWidth={1.5} />
          </div>

          {/* Frase principal - emocional e acolhedora */}
          <h2 className="text-xl text-text-primary dark:text-text-primary-dark mb-2 leading-relaxed" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>
            {headerPhrases.primary}
          </h2>
          
          {/* Frase secundária - calma e tranquilizadora, mais etérea */}
          <p className="text-sm text-text-secondary/40 dark:text-text-secondary-dark/40 leading-relaxed max-w-xs mx-auto" style={{ letterSpacing: '0.01em', fontWeight: 400 }}>
            {headerPhrases.secondary}
          </p>
        </div>

        {/* Pausa visual antes do conteúdo */}
        <div className="pt-8">
          {/* Memory Spaces "fantasmas" */}
          <div className="space-y-5">
          {spaces.map((space) => {
            // Determinar emptyText baseado no tipo de space
            let emptyText: string | undefined;
            if ('emptyText' in space) {
              emptyText = space.emptyText;
            } else if ('memories' in space) {
              emptyText = (space.memories?.length || 0) === 0 
                ? 'Aos poucos, suas memórias encontram lugar aqui.' 
                : undefined;
            } else {
              emptyText = 'Aos poucos, suas memórias encontram lugar aqui.';
            }

            const count = 'memories' in space ? (space.memories?.length || 0) : 0;

            return (
              <MemorySpaceCard
                key={space.spaceId}
                spaceId={space.spaceId}
                title={space.title}
                icon={space.icon}
                count={count}
                isEmpty={true}
                emptyText={emptyText}
                onClick={() => {
                  if (onSpaceClick && count > 0) {
                    onSpaceClick(space.spaceId);
                  }
                }}
              />
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
