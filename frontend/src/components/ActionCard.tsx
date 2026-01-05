/**
 * Cartão de confirmação de ação
 * Exibe ações registradas de forma limpa e objetiva
 */
import { CheckCircle2, ClipboardList, FileText, Bell, Sparkles } from 'lucide-react';
import type { MemoryInterpretationResponse } from '../services/api';

interface ActionCardProps {
  interpretation: MemoryInterpretationResponse['interpretation'];
  needsConfirmation?: boolean;
  interactionId?: string;
  onConfirm?: (interactionId: string) => void;
  onReject?: (interactionId: string) => void;
  isConfirming?: boolean;
}

export function ActionCard({
  interpretation,
  needsConfirmation,
  interactionId,
  onConfirm,
  onReject,
  isConfirming = false,
}: ActionCardProps) {
  const getTypeInfo = () => {
    switch (interpretation.action_type) {
      case 'task':
        return {
          label: 'Tarefa',
          Icon: ClipboardList,
          color: 'bg-blue-50/30 border-blue-200/40',
          iconColor: 'text-blue-primary/80',
        };
      case 'note':
        return {
          label: 'Nota',
          Icon: FileText,
          color: 'bg-green-50/30 border-green-200/40',
          iconColor: 'text-green-600/80',
        };
      case 'reminder':
        return {
          label: 'Lembrete',
          Icon: Bell,
          color: 'bg-purple-50/30 border-purple-200/40',
          iconColor: 'text-purple-600/80',
        };
      default:
        return {
          label: 'Registro',
          Icon: Sparkles,
          color: 'bg-gray-50/30 border-gray-200/40',
          iconColor: 'text-text-secondary/60',
        };
    }
  };

  /**
   * Formata data em formato humano
   */
  const formatHumanDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (diffDays === 0) {
      return `Hoje às ${timeStr}`;
    } else if (diffDays === 1) {
      return `Amanhã às ${timeStr}`;
    } else if (diffDays === -1) {
      return `Ontem às ${timeStr}`;
    } else if (diffDays > 0 && diffDays < 7) {
      const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      return `${weekdays[date.getDay()]} às ${timeStr}`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getContent = () => {
    if (interpretation.task) {
      return interpretation.task.title;
    }
    if (interpretation.note) {
      return interpretation.note.title || interpretation.note.content;
    }
    if (interpretation.reminder) {
      return interpretation.reminder.title;
    }
    return 'Registro';
  };

  const getDetails = () => {
    const details: Array<{ label: string; value: string }> = [];

    if (interpretation.task) {
      if (interpretation.task.due_date) {
        details.push({ label: 'Prazo', value: formatHumanDate(interpretation.task.due_date) });
      }
      if (interpretation.task.priority) {
        const priorityLabels: Record<'low' | 'medium' | 'high', string> = {
          low: 'Baixa',
          medium: 'Média',
          high: 'Alta',
        };
        details.push({ label: 'Prioridade', value: priorityLabels[interpretation.task.priority] });
      }
    }

    if (interpretation.reminder) {
      if (interpretation.reminder.reminder_date) {
        details.push({ label: 'Quando', value: formatHumanDate(interpretation.reminder.reminder_date) });
      }
      if (interpretation.reminder.is_recurring) {
        details.push({ label: 'Recorrência', value: 'Ativa' });
      }
    }

    return details;
  };

  const showConfirmationButtons =
    needsConfirmation &&
    interactionId &&
    onConfirm &&
    onReject &&
    interpretation.action_type !== 'unknown';

  // Quando a IA não conseguiu classificar claramente, tratar como nota genérica
  if (interpretation.action_type === 'unknown') {
    const typeInfo = {
      label: 'Pensamento',
      Icon: Sparkles,
      color: 'bg-gray-50/50 border-gray-200/60',
      iconColor: 'text-text-secondary/70',
    };
    const { Icon } = typeInfo;
    
    // Usar o texto original do usuário ou mensagem genérica
    const content = interpretation.note?.content || interpretation.note?.title || 'Registro salvo.';
    
    return (
      <div className={`border rounded-2xl p-4 shadow-sm ${typeInfo.color}`}>
        <div className="flex items-start gap-3">
          {/* Ícone do tipo */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center border border-border/30">
            <Icon className={`w-5 h-5 ${typeInfo.iconColor}`} strokeWidth={2} />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header com tipo */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-text-secondary" style={{ fontWeight: 500 }}>
                {typeInfo.label}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" strokeWidth={2} />
            </div>
            
            {/* Conteúdo principal */}
            <p className="text-text-primary text-base mb-2 break-words leading-snug" style={{ fontWeight: 500 }}>
              {content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = getTypeInfo();
  const { Icon } = typeInfo;
  const details = getDetails();

  return (
    <div className={`border rounded-2xl p-5 shadow-sm ${typeInfo.color}`}>
      <div className="flex items-start gap-4">
        {/* Ícone do tipo - mais discreto */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center border border-border/20">
          <Icon className={`w-4 h-4 ${typeInfo.iconColor} opacity-70`} strokeWidth={2} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header com tipo - muito discreto, como metadado */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-text-secondary/50" style={{ fontWeight: 400 }}>
              {typeInfo.label}
            </span>
            {!needsConfirmation && (
              <CheckCircle2 className="w-3 h-3 text-green-600/60" strokeWidth={2} />
            )}
          </div>
          
          {/* Conteúdo principal - hierarquia máxima */}
          <p className="text-text-primary text-xl mb-4 break-words leading-tight" style={{ fontWeight: 600 }}>
            {getContent()}
          </p>
          
          {/* Detalhes formatados - mais suaves */}
          {details.length > 0 && (
            <div className="mt-4 space-y-2">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-xs text-text-secondary/50 min-w-[60px]" style={{ fontWeight: 500 }}>
                    {detail.label}:
                  </span>
                  <span className="text-xs text-text-secondary/70 flex-1">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Descrições adicionais - mais suaves */}
          {interpretation.task?.description && (
            <p className="text-xs text-text-secondary/70 mt-4 pt-4 border-t border-border/20 break-words leading-relaxed">
              {interpretation.task.description}
            </p>
          )}
          {interpretation.note?.content && !interpretation.note.title && (
            <p className="text-xs text-text-secondary/70 mt-4 pt-4 border-t border-border/20 break-words leading-relaxed">
              {interpretation.note.content}
            </p>
          )}
          {interpretation.reminder?.description && (
            <p className="text-xs text-text-secondary/70 mt-4 pt-4 border-t border-border/20 break-words leading-relaxed">
              {interpretation.reminder.description}
            </p>
          )}
        </div>
      </div>
      {showConfirmationButtons && (
        <div className="mt-5 pt-5 border-t border-border/30 flex gap-3">
          <button
            onClick={() => onConfirm(interactionId)}
            disabled={isConfirming}
            className="flex-1 px-4 py-2.5 bg-blue-primary text-white rounded-xl text-sm hover:bg-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            style={{ fontWeight: 500 }}
          >
            {isConfirming ? 'Confirmando...' : 'Aceitar'}
          </button>
          <button
            onClick={() => onReject(interactionId)}
            disabled={isConfirming}
            className="flex-1 px-4 py-2.5 bg-white border border-border/50 text-text-secondary rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

