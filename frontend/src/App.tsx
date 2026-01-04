/**
 * Componente principal da aplicação - Interface de Chat
 */
import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MemoryTimeline, type MemoryEntry } from './components/MemoryTimeline';
import { MessageInput } from './components/MessageInput';
import { interpretText, type InterpretResponse } from './services/api';

function App() {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = useCallback(async (text: string) => {
    // Adicionar mensagem do usuário
    const userInput: MemoryEntry = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMemories((prev) => [...prev, userInput]);
    setIsLoading(true);

    // Adicionar mensagem de loading do assistente
    const processingIndicator: MemoryEntry = {
      id: `loading-${Date.now()}`,
      type: 'loading',
      timestamp: new Date(),
    };

    setMemories((prev) => [...prev, processingIndicator]);

    try {
      // Chamar API (sem autenticação por enquanto, conforme requisito)
      const response: InterpretResponse = await interpretText(text);

      // Remover mensagem de loading e adicionar resposta do assistente
      setMemories((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== processingIndicator.id);
        const savedAction: MemoryEntry = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          interpretation: response.interpretation,
          timestamp: new Date(),
        };
        return [...withoutLoading, savedAction];
      });
    } catch (error) {
      // Remover mensagem de loading e adicionar mensagem de erro
      setMemories((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== processingIndicator.id);
        const errorEntry: MemoryEntry = {
          id: `error-${Date.now()}`,
          type: 'error',
          content:
            error instanceof Error
              ? error.message
              : 'Erro ao processar sua entrada',
          timestamp: new Date(),
        };
        return [...withoutLoading, errorEntry];
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header fixo */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-primary rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              Lumeo
            </h1>
            <p className="text-xs text-text-secondary">
              Seu assistente de memória pessoal
            </p>
          </div>
        </div>
      </header>

      {/* Área de chat com scroll */}
      <MemoryTimeline messages={memories} />

      {/* Barra de entrada fixa na parte inferior */}
      <MessageInput onSend={handleSave} disabled={isLoading} />
    </div>
  );
}

export default App;
