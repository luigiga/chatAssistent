/**
 * Indicador de carregamento com dots animados
 */
export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-text-secondary/70 dark:text-text-secondary-dark/70 text-xs">organizando</span>
      <div className="flex gap-0.5">
        <span 
          className="w-1 h-1 bg-text-secondary/50 dark:bg-text-secondary-dark/50 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-1 h-1 bg-text-secondary/50 dark:bg-text-secondary-dark/50 rounded-full animate-bounce" 
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-1 h-1 bg-text-secondary/50 dark:bg-text-secondary-dark/50 rounded-full animate-bounce" 
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
        ></span>
      </div>
    </div>
  );
}

