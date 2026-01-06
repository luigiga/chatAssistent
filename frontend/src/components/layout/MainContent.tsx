/**
 * Container principal de conteúdo
 * Wrapper para o conteúdo da tela atual
 * 
 * FUTURO: Cada tela (Memórias, Busca, Perfil) será renderizada aqui
 */
import type { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <div className={`flex-1 flex flex-col pt-16 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

