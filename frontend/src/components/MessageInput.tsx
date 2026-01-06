/**
 * Campo de captura de pensamento
 * Design minimalista para registro de memórias, não conversa
 */
import { Check, Edit } from 'lucide-react';
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
    <form 
      className="relative group"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      {/* Ícone à esquerda */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40 dark:text-text-secondary-dark/40 transition-colors group-focus-within:text-blue-primary z-10">
        <Edit className="w-5 h-5" strokeWidth={2} />
      </div>
      
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Digite aqui... pode ser qualquer coisa"
          rows={1}
          className={`w-full pl-12 pr-14 py-4 border-0 bg-gray-100 dark:bg-slate-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-primary focus:bg-white dark:focus:bg-surface-dark disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-base text-text-primary dark:text-text-primary-dark placeholder:text-text-secondary/50 dark:placeholder:text-text-secondary-dark/50 transition-all shadow-inner ${
            isHighlighted ? 'ring-2 ring-blue-primary/30 bg-white dark:bg-surface-dark' : ''
          }`}
          style={{
            minHeight: '64px',
            maxHeight: '140px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 140)}px`;
          }}
        />
        {/* Botão integrado dentro do campo - mais gesto, menos botão */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-primary text-white rounded-xl hover:bg-blue-hover disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          style={{ transitionDuration: '150ms' }}
          aria-label="Registrar"
          title="Registrar"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
}
