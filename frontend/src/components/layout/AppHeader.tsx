/**
 * Header da aplicação
 * 
 * FUTURO: Componente reutilizável para header em todas as telas
 * Pode incluir:
 * - Título dinâmico baseado na tela atual
 * - Botões de ação contextuais
 * - Breadcrumbs (se necessário)
 */
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AppHeader({ title = 'Lumeo', subtitle, actions }: AppHeaderProps) {
  // Se não houver título, renderizar header minimalista (para aba Memórias)
  if (!title) {
    return (
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border/10 dark:border-border-dark/10 flex-shrink-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center justify-end">
          {actions && <div className="flex items-center gap-4">{actions}</div>}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border/10 dark:border-border-dark/10 flex-shrink-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-medium text-text-primary dark:text-text-primary-dark" style={{ fontWeight: 500 }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-secondary/70 dark:text-text-secondary-dark/70" style={{ fontWeight: 400 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </header>
  );
}

