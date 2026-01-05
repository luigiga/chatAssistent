/**
 * Balão de memória (usuário ou assistente)
 */
import { LoadingIndicator } from './LoadingIndicator';
import { ActionCard } from './ActionCard';
import type { MemoryInterpretationResponse } from '../services/api';

export type MemoryEntryType = 'user' | 'assistant' | 'error' | 'loading';

interface MemoryEntryProps {
  type: MemoryEntryType;
  content?: string;
  interpretation?: MemoryInterpretationResponse['interpretation'];
  interactionId?: string;
  needsConfirmation?: boolean;
  onConfirm?: (interactionId: string) => void;
  onReject?: (interactionId: string) => void;
  isConfirming?: boolean;
  timestamp?: Date;
}

export function MessageBubble({
  type,
  content,
  interpretation,
  interactionId,
  needsConfirmation,
  onConfirm,
  onReject,
  isConfirming = false,
  timestamp,
}: MemoryEntryProps) {
  if (type === 'loading') {
    return (
      <div className="flex items-center gap-2 py-2">
        <LoadingIndicator />
      </div>
    );
  }

  // Tipo 'error' não deve mais ser usado - sempre salvar como memória
  // Mantido apenas para compatibilidade, mas não deve aparecer
  if (type === 'error') {
    // Transformar erro em confirmação neutra
    return (
      <div className="py-1">
        <p className="text-text-secondary text-xs whitespace-pre-wrap break-words">
          Registro salvo.
        </p>
      </div>
    );
  }

  if (type === 'user') {
    // Entrada do usuário como registro de pensamento, não mensagem de chat
    const timeStr = timestamp
      ? timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '';
    
    return (
      <div className="flex items-start gap-3">
        {/* Indicador de registro */}
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-primary mt-1.5" />
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
          {timeStr && (
            <p className="text-text-secondary/60 text-xs mt-1">
              {timeStr}
            </p>
          )}
        </div>
      </div>
    );
  }

  // type === 'assistant' - mostrar cartão de ação se tiver interpretação
  // Card de ação é o elemento principal, sem padding extra
  if (interpretation) {
    return (
      <div>
        <ActionCard
          interpretation={interpretation}
          needsConfirmation={needsConfirmation}
          interactionId={interactionId}
          onConfirm={onConfirm}
          onReject={onReject}
          isConfirming={isConfirming}
        />
      </div>
    );
  }

  // Fallback para conteúdo simples (confirmações silenciosas)
  return (
    <div className="py-1">
      <p className="text-text-secondary text-xs whitespace-pre-wrap break-words">
        {content || ''}
      </p>
    </div>
  );
}

