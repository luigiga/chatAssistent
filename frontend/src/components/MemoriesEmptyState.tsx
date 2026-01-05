/**
 * Estado vazio da aba Memórias
 * Aconchegante, contemplativo e emocionalmente confortável
 */
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Frases dinâmicas para o empty state
 * Curta, humanas, não motivacionais exageradas
 */
const emptyStatePhrases = [
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

export function MemoriesEmptyState() {
  // Selecionar uma frase aleatória (pode ser melhorado com persistência)
  const selectedPhrase = useMemo(() => {
    return emptyStatePhrases[Math.floor(Math.random() * emptyStatePhrases.length)];
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-sm">
        {/* Ícone do Lumeo - grande, suave e em baixa opacidade */}
        <div className="w-24 h-24 bg-blue-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-12 h-12 text-blue-primary/30" strokeWidth={1.5} />
        </div>

        {/* Frase principal - emocional e acolhedora */}
        <h2 className="text-lg text-text-primary mb-3 leading-relaxed" style={{ fontWeight: 500 }}>
          {selectedPhrase.primary}
        </h2>
        
        {/* Frase secundária - calma e tranquilizadora */}
        <p className="text-sm text-text-secondary/50 leading-relaxed">
          {selectedPhrase.secondary}
        </p>
      </div>
    </div>
  );
}

