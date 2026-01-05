/**
 * Tela de Captura - Página Principal
 * Design iOS + Magic UI - Foco total no input de pensamentos
 */
import { useState } from 'react';
import { Sparkles, Zap, Brain, Heart } from 'lucide-react';
import type { MemoryEntry } from '../components/MemoryTimeline';

interface MemoriesPageProps {
  memories: MemoryEntry[];
  onSave: (text: string) => void;
  onConfirm?: (interactionId: string) => void;
  onReject?: (interactionId: string) => void;
  confirmingIds?: Set<string>;
  isLoading?: boolean;
  highlightInput?: boolean;
}

export function MemoriesPage({
  onSave,
  isLoading = false,
}: MemoriesPageProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSave(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const quickActions = [
    { icon: Zap, label: 'Ideia rápida', color: 'from-yellow-400 to-orange-500' },
    { icon: Brain, label: 'Pensamento', color: 'from-purple-400 to-pink-500' },
    { icon: Heart, label: 'Lembrete', color: 'from-red-400 to-rose-500' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-2xl">
        {/* Header com gradiente sutil */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl mb-6 shadow-lg border border-white/20">
            <Sparkles className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-semibold text-text-primary mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
            O que você quer lembrar?
          </h1>
          <p className="text-base text-text-secondary/60 max-w-md mx-auto leading-relaxed">
            Capture qualquer pensamento, ideia ou lembrete. Organize depois.
          </p>
        </div>

        {/* Campo de input principal - Magic UI */}
        <div className={`relative mb-8 transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              placeholder="Digite aqui..."
              rows={4}
              className={`w-full px-6 py-5 bg-white/80 backdrop-blur-xl border-2 rounded-3xl resize-none
                focus:outline-none text-lg text-text-primary placeholder:text-text-secondary/40
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl
                ${isFocused
                  ? 'border-blue-500/50 bg-white shadow-2xl shadow-blue-500/20'
                  : 'border-gray-200/50 hover:border-gray-300/50'
                }`}
              style={{
                minHeight: '140px',
                maxHeight: '300px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 300)}px`;
              }}
            />

            {/* Botão de enviar - Design iOS */}
            <button
              onClick={handleSave}
              disabled={!input.trim() || isLoading}
              className={`absolute right-4 bottom-4 flex items-center justify-center w-12 h-12 rounded-2xl
                transition-all duration-200 shadow-lg
                ${input.trim() && !isLoading
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Contador de caracteres sutil */}
          {input.length > 0 && (
            <div className="absolute -bottom-6 right-0 text-xs text-text-secondary/50">
              {input.length} caracteres
            </div>
          )}
        </div>

        {/* Quick actions - iOS style */}
        <div className="mt-12">
          <p className="text-sm text-text-secondary/60 text-center mb-4 font-medium">
            Sugestões rápidas
          </p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => setIsFocused(true)}
                  className="group relative p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50
                    hover:bg-white hover:shadow-lg transition-all duration-200 active:scale-95"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color}
                    flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-xs text-text-secondary/80 font-medium text-center">
                    {action.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info card - Glassmorphism */}
        <div className="mt-12 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                Capture sem preocupação
              </h3>
              <p className="text-xs text-text-secondary/70 leading-relaxed">
                Não precisa organizar agora. O Lumeo entende suas ideias e as organiza automaticamente
                em tarefas, notas e lembretes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
