/**
 * Painel de resultado (JSON formatado)
 */
import type { MemoryInterpretationResponse } from '../services/api';

interface ResultPanelProps {
  result: MemoryInterpretationResponse;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const formatJSON = (obj: unknown): string => {
    return JSON.stringify(obj, null, 2);
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'task':
        return 'bg-blue-soft text-blue-primary';
      case 'note':
        return 'bg-green-50 text-success';
      case 'reminder':
        return 'bg-purple-50 text-purple-600';
      case 'unknown':
        return 'bg-gray-100 text-text-secondary';
      default:
        return 'bg-gray-100 text-text-secondary';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${getActionTypeColor(
              result.interpretation.action_type
            )}`}
          >
            {result.interpretation.action_type.toUpperCase()}
          </span>
          {result.executed && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 text-success">
              EXECUTADO
            </span>
          )}
          {result.interpretation.needs_confirmation && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-50 text-yellow-600">
              PRECISA CONFIRMAÇÃO
            </span>
          )}
        </div>
      </div>

      {result.interpretation.confirmation_message && (
        <div className="mb-4 p-4 bg-blue-soft rounded-xl">
          <p className="text-sm text-blue-primary font-medium">
            {result.interpretation.confirmation_message}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {result.interpretation.task && (
          <div className="p-4 bg-blue-soft/30 rounded-xl">
            <h4 className="font-semibold text-text-primary mb-2">Tarefa</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-secondary">Título:</span>{' '}
                <span className="text-text-primary font-medium">
                  {result.interpretation.task.title}
                </span>
              </p>
              {result.interpretation.task.description && (
                <p>
                  <span className="text-text-secondary">Descrição:</span>{' '}
                  <span className="text-text-primary">
                    {result.interpretation.task.description}
                  </span>
                </p>
              )}
              {result.interpretation.task.due_date && (
                <p>
                  <span className="text-text-secondary">Data:</span>{' '}
                  <span className="text-text-primary">
                    {new Date(result.interpretation.task.due_date).toLocaleString('pt-BR')}
                  </span>
                </p>
              )}
              {result.interpretation.task.priority && (
                <p>
                  <span className="text-text-secondary">Prioridade:</span>{' '}
                  <span className="text-text-primary font-medium capitalize">
                    {result.interpretation.task.priority}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {result.interpretation.note && (
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-text-primary mb-2">Nota</h4>
            <div className="space-y-1 text-sm">
              {result.interpretation.note.title && (
                <p>
                  <span className="text-text-secondary">Título:</span>{' '}
                  <span className="text-text-primary font-medium">
                    {result.interpretation.note.title}
                  </span>
                </p>
              )}
              <p>
                <span className="text-text-secondary">Conteúdo:</span>{' '}
                <span className="text-text-primary">
                  {result.interpretation.note.content}
                </span>
              </p>
            </div>
          </div>
        )}

        {result.interpretation.reminder && (
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-semibold text-text-primary mb-2">Lembrete</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-text-secondary">Título:</span>{' '}
                <span className="text-text-primary font-medium">
                  {result.interpretation.reminder.title}
                </span>
              </p>
              {result.interpretation.reminder.reminder_date && (
                <p>
                  <span className="text-text-secondary">Data:</span>{' '}
                  <span className="text-text-primary">
                    {new Date(result.interpretation.reminder.reminder_date).toLocaleString('pt-BR')}
                  </span>
                </p>
              )}
              {result.interpretation.reminder.is_recurring && (
                <p>
                  <span className="text-text-secondary">Recorrente:</span>{' '}
                  <span className="text-text-primary font-medium">Sim</span>
                  {result.interpretation.reminder.recurrence_rule && (
                    <span className="text-text-primary ml-1">
                      ({result.interpretation.reminder.recurrence_rule})
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-2">
          Ver JSON completo
        </summary>
        <pre className="bg-gray-50 border border-border rounded-xl p-4 overflow-x-auto text-xs text-text-primary">
          <code>{formatJSON(result)}</code>
        </pre>
      </details>
    </div>
  );
}

