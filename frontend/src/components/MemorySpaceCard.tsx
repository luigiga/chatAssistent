/**
 * Card de Memory Space (espaço mental)
 * Representa um agrupamento de memórias na biblioteca silenciosa
 * Visual iOS-like premium, contemplativo
 */
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export type MemorySpaceKey = 'today' | 'thisWeek' | 'ideas' | 'routine' | 'older';

interface MemorySpaceCardProps {
  spaceId: MemorySpaceKey;
  title: string;
  icon: LucideIcon;
  count: number;
  preview?: string; // 1 linha de exemplo de memória (opcional, bem discreto)
  isEmpty?: boolean;
  emptyText?: string;
  onClick: () => void;
}

export function MemorySpaceCard({
  title,
  icon: Icon,
  count,
  preview,
  isEmpty = false,
  emptyText,
  onClick,
}: MemorySpaceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left"
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Card como "sala", não botão - reduzido contraste, sem hover chamativo */}
      <div className="border rounded-3xl p-14 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm border-border/20 dark:border-border-dark/20 shadow transition-all min-h-[140px]">
        <div className="flex items-start gap-8">
          {/* Ícone maior e mais discreto */}
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-primary/3 dark:bg-blue-primary/8 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-primary/30 dark:text-blue-400/50" strokeWidth={1.5} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Título claro */}
            <h3 className="text-lg text-text-primary dark:text-text-primary-dark mb-3" style={{ fontWeight: 500, letterSpacing: '-0.01em' }}>
              {title}
            </h3>

            {/* Conteúdo: contagem ou empty text */}
            {isEmpty ? (
              <p className="text-sm text-text-secondary/45 dark:text-text-secondary-dark/45 leading-relaxed" style={{ fontWeight: 400 }}>
                {emptyText || 'Aos poucos, suas memórias encontram lugar aqui.'}
              </p>
            ) : (
              <>
                {/* Contagem muito discreta */}
                <p className="text-[11px] text-text-secondary/30 dark:text-text-secondary-dark/30 mb-3" style={{ fontWeight: 400, letterSpacing: '0.02em' }}>
                  {count} {count === 1 ? 'item' : 'itens'}
                </p>

                {/* Preview como "eco distante" - neutro, quase etéreo */}
                {preview ? (
                  <p className="text-sm text-text-secondary/35 dark:text-text-secondary-dark/35 leading-relaxed line-clamp-1 italic" style={{ fontWeight: 400 }}>
                    {preview}
                  </p>
                ) : (
                  <p className="text-sm text-text-secondary/35 dark:text-text-secondary-dark/35 leading-relaxed italic" style={{ fontWeight: 400 }}>
                    Aos poucos, suas memórias encontram lugar aqui.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

