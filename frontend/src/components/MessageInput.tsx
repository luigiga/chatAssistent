/**
 * Barra de entrada de mensagem fixa na parte inferior
 */
import { useState, KeyboardEvent } from 'react';

interface MemoryInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MemoryInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="O que você quer lembrar?"
              rows={1}
              className="w-full px-4 py-3 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="flex items-center justify-center w-12 h-12 bg-blue-primary text-white rounded-full hover:bg-blue-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Registrar memória"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

