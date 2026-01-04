/**
 * Estado de carregamento
 */
export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-soft border-t-blue-primary rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-text-secondary text-sm font-medium">
        Processando sua mensagem...
      </p>
    </div>
  );
}

