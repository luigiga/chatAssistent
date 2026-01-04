/**
 * Container principal do chat com scroll
 */
import { useEffect, useRef } from 'react';
import { MessageBubble, type MemoryEntryType } from './MessageBubble';
import type { InterpretResponse } from '../services/api';

export interface MemoryEntry {
  id: string;
  type: MemoryEntryType;
  content?: string;
  interpretation?: InterpretResponse['interpretation'];
  timestamp: Date;
}

interface MemoryTimelineProps {
  messages: MemoryEntry[];
}

export function MemoryTimeline({ messages }: MemoryTimelineProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll automático para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary text-sm">
            <p>Registre sua primeira memória ou ação...</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              type={message.type}
              content={message.content}
              interpretation={message.interpretation}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

