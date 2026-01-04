/**
 * Header minimalista
 */
export function Header() {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-text-primary">
          Interpretador de Texto
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Transforme sua mensagem em ações estruturadas
        </p>
      </div>
    </header>
  );
}

