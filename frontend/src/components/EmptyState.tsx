/**
 * Estado vazio da tela principal
 * Convidativo e acolhedor, reforçando a identidade do Lumeo
 */
import { Sparkles, Bell, Lightbulb, Calendar, Gift } from 'lucide-react';

interface EmptyStateProps {
  onSuggestionClick?: (text: string) => void;
}

interface Suggestion {
  text: string;
  icon: typeof Bell;
  type: 'reminder' | 'idea' | 'meeting' | 'task';
  iconColor: string;
}

const suggestions: Suggestion[] = [
  { text: 'Lembrar de pagar internet dia 10', icon: Bell, type: 'reminder', iconColor: 'text-red-500' },
  { text: 'Ideia para o projeto de fotos', icon: Lightbulb, type: 'idea', iconColor: 'text-yellow-500' },
  { text: 'Reunião com cliente amanhã às 14h', icon: Calendar, type: 'meeting', iconColor: 'text-purple-500' },
  { text: 'Comprar presente de aniversário', icon: Gift, type: 'task', iconColor: 'text-pink-500' },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8 bg-background dark:bg-background-dark">
      {/* Ícone do Lumeo - etéreo e secundário */}
      <div className="w-12 h-12 bg-blue-primary/5 dark:bg-blue-primary/10 rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-blue-primary/40 dark:text-blue-primary/50" strokeWidth={1.5} />
      </div>

      {/* Texto principal - foco visual */}
      <h2 className="text-base text-text-primary dark:text-text-primary-dark mb-3" style={{ fontWeight: 600 }}>
        O que está passando pela sua cabeça agora?
      </h2>
      <p className="text-xs text-text-secondary/45 dark:text-text-secondary-dark/45 mb-8 max-w-sm leading-relaxed" style={{ letterSpacing: '0.01em' }}>
        Anote sem pensar demais. O Lumeo organiza e lembra por você.
      </p>

      {/* Sugestões - com ícones sutis */}
      {onSuggestionClick && (
        <div className="w-full max-w-md">
          <p className="text-xs text-text-secondary/40 dark:text-text-secondary-dark/40 mb-3.5" style={{ fontWeight: 500 }}>
            Comece com um exemplo:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="group flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-surface-dark border border-border/50 dark:border-border-dark/50 rounded-full text-xs text-text-secondary dark:text-text-secondary-dark hover:border-blue-primary/50 hover:text-blue-primary hover:bg-blue-primary/5 dark:hover:bg-blue-primary/10 transition-all active:scale-[0.98]"
                  style={{ fontWeight: 400, transitionDuration: '150ms' }}
                >
                  <Icon className={`w-3.5 h-3.5 ${suggestion.iconColor} group-hover:opacity-80 transition-opacity`} strokeWidth={2} />
                  <span>{suggestion.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

