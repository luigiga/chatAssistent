/**
 * Página de Memórias (Timeline)
 * 
 * FUTURO: Esta será uma das telas principais do Lumeo
 * Acessível via Tab Bar ou rota /memories
 * 
 * Status: Atualmente é a tela principal (única tela)
 * Quando navegação for implementada, este componente será usado
 * para renderizar a timeline de memórias
 */
import { useState } from 'react';
import { MemoryTimeline, type MemoryEntry } from '../components/MemoryTimeline';
import { MessageInput } from '../components/MessageInput';

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
  memories,
  onSave,
  onConfirm,
  onReject,
  confirmingIds,
  isLoading = false,
  highlightInput = false,
}: MemoriesPageProps) {
  const [inputValue, setInputValue] = useState('');

  // Handler para sugestões - preencher o input e posicionar cursor no final
  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    // Focar no input e posicionar cursor no final após um pequeno delay
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        // Posicionar cursor no final do texto
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
    }, 100);
  };

  // Handler para salvar - limpar input após salvar
  const handleSave = (text: string) => {
    onSave(text);
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Área de memórias com scroll */}
      <div className="flex-1 overflow-y-auto">
        <MemoryTimeline
          memories={memories}
          onConfirm={onConfirm}
          onReject={onReject}
          confirmingIds={confirmingIds}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

      {/* Campo de captura integrado ao conteúdo - elemento principal */}
      <div className="border-t border-border/50 bg-white/98 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <MessageInput 
            onSend={handleSave} 
            disabled={isLoading}
            initialValue={inputValue}
            highlight={highlightInput}
          />
        </div>
        {/* Espaço reservado abaixo do input para transição suave */}
        <div className="h-2" />
      </div>
    </div>
  );
}

