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
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border bg-white flex-shrink-0">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary" style={{ fontWeight: 600 }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-secondary font-normal">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </header>
  );
}

