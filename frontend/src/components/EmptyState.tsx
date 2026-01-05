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
}

const suggestions: Suggestion[] = [
  { text: 'Lembrar de pagar internet dia 10', icon: Bell, type: 'reminder' },
  { text: 'Ideia para o projeto de fotos', icon: Lightbulb, type: 'idea' },
  { text: 'Reunião com cliente amanhã às 14h', icon: Calendar, type: 'meeting' },
  { text: 'Comprar presente de aniversário', icon: Gift, type: 'task' },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-8">
      {/* Ícone do Lumeo - etéreo e secundário */}
      <div className="w-12 h-12 bg-blue-primary/5 rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-blue-primary/40" strokeWidth={1.5} />
      </div>

      {/* Texto principal - foco visual */}
      <h2 className="text-base text-text-primary mb-3" style={{ fontWeight: 600 }}>
        O que está passando pela sua cabeça agora?
      </h2>
      <p className="text-xs text-text-secondary/45 mb-8 max-w-sm leading-relaxed" style={{ letterSpacing: '0.01em' }}>
        Anote sem pensar demais. O Lumeo organiza e lembra por você.
      </p>

      {/* Sugestões - com ícones sutis */}
      {onSuggestionClick && (
        <div className="w-full max-w-md">
          <p className="text-xs text-text-secondary/40 mb-3.5" style={{ fontWeight: 500 }}>
            Comece com um exemplo:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="group flex items-center gap-2 px-3.5 py-2 bg-white border border-border/50 rounded-full text-xs text-text-secondary hover:border-blue-primary/50 hover:text-blue-primary hover:bg-blue-primary/5 transition-all active:scale-[0.98]"
                  style={{ fontWeight: 400, transitionDuration: '150ms' }}
                >
                  <Icon className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-blue-primary/70 transition-colors" strokeWidth={2} />
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

