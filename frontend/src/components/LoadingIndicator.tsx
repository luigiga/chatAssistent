/**
 * Indicador de carregamento com dots animados
 */
export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-text-secondary text-sm">processando</span>
      <div className="flex gap-1">
        <span 
          className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" 
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
        ></span>
        <span 
          className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" 
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
        ></span>
      </div>
    </div>
  );
}

