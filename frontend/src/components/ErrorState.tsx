/**
 * Estado de erro
 */
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-surface dark:bg-surface-dark border border-error/20 dark:border-error/30 rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-error dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-text-primary dark:text-text-primary-dark font-semibold mb-1">Erro</h3>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-blue-primary text-sm font-medium hover:text-blue-hover transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

