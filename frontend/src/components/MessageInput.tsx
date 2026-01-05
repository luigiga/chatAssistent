/**
 * Campo de captura de pensamento
 * Design minimalista para registro de memórias, não conversa
 */
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface MemoryInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
  highlight?: boolean;
}

export function MessageInput({ onSend, disabled, initialValue = '', highlight = false }: MemoryInputProps) {
  const [input, setInput] = useState(initialValue);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Sincronizar com initialValue quando mudar externamente
  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  // Efeito de destaque sutil após criação de memória
  useEffect(() => {
    if (highlight) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 600);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  const handleSave = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="px-4 py-5">
      <div className="relative flex items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Digite aqui. Pode ser qualquer coisa."
            rows={1}
            className={`w-full px-5 py-4.5 pr-14 border-0 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-primary/20 focus:bg-white disabled:bg-gray-50 disabled:cursor-not-allowed text-base text-text-primary placeholder:text-text-secondary/45 transition-all shadow-sm ${
              isHighlighted ? 'ring-2 ring-blue-primary/30 bg-white' : ''
            }`}
            style={{
              minHeight: '64px',
              maxHeight: '140px',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
            }}
          />
          {/* Botão integrado dentro do campo - mais gesto, menos botão */}
          <button
            onClick={handleSave}
            disabled={!input.trim() || disabled}
            className="absolute right-3 bottom-3.5 flex items-center justify-center w-8 h-8 bg-blue-primary text-white rounded-xl hover:bg-blue-hover disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            style={{ transitionDuration: '150ms' }}
            aria-label="Registrar"
            title="Registrar"
          >
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
