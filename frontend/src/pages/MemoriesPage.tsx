/**
 * Tela de Captura - Página Principal
 * Design iOS + Magic UI - Foco total no input de pensamentos
 */
import { useState } from 'react';
import { PlusCircle, FileText, User } from 'lucide-react';
import { MemoryTimeline, type MemoryEntry } from '../components/MemoryTimeline';
import { MessageInput } from '../components/MessageInput';
import type { TabId } from '../components/navigation/TabBar';

interface MemoriesPageProps {
  memories: MemoryEntry[];
  onSave: (text: string) => void;
  onConfirm?: (interactionId: string) => void;
  onReject?: (interactionId: string) => void;
  confirmingIds?: Set<string>;
  isLoading?: boolean;
  highlightInput?: boolean;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

export function MemoriesPage({
  memories,
  onSave,
  onConfirm,
  onReject,
  confirmingIds,
  isLoading = false,
  highlightInput = false,
  activeTab = 'capture',
  onTabChange,
}: MemoriesPageProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSave = (text: string) => {
    onSave(text);
    setInputValue('');
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-background dark:bg-background-dark">
      {/* Área de memórias com scroll */}
      <MemoryTimeline
        memories={memories}
        onConfirm={onConfirm}
        onReject={onReject}
        confirmingIds={confirmingIds}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Campo de captura fixo no bottom - estilo iOS-like */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-border/50 dark:border-border-dark/50 rounded-t-3xl shadow-lg pt-4 px-4 pb-2">
        <div className="max-w-md mx-auto">
          <MessageInput 
            onSend={handleSave} 
            disabled={isLoading}
            initialValue={inputValue}
            highlight={highlightInput}
          />
          {/* TabBar integrado - versão inline com altura padronizada */}
          {onTabChange && (
            <div className="flex justify-around items-center mt-4 px-2 py-1.5">
              {[
                { id: 'capture' as TabId, label: 'Capturar', Icon: PlusCircle },
                { id: 'memories' as TabId, label: 'Memórias', Icon: FileText },
                { id: 'profile' as TabId, label: 'Você', Icon: User },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.Icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all duration-200 ${
                      isActive
                        ? 'text-blue-primary'
                        : 'text-text-secondary/70 dark:text-text-secondary-dark/70 hover:text-text-secondary dark:hover:text-text-secondary-dark'
                    }`}
                    aria-label={tab.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent 
                      className={`w-5 h-5 mb-0.5 transition-all duration-200 ${isActive ? 'scale-105 text-blue-primary' : 'text-text-secondary/70 dark:text-text-secondary-dark/70'}`} 
                      strokeWidth={isActive ? 2.5 : 2} 
                    />
                    <span className="text-xs" style={{ fontWeight: isActive ? 600 : 400 }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
