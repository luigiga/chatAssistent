/**
 * Glass Card - Card com efeito glass premium
 * Backdrop blur + background translúcido + border sutil + shadow suave
 */
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export function GlassCard({ children, className = '', onClick, padding = 'md' }: GlassCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const baseClasses = cn(
    'rounded-2xl bg-white/60 dark:bg-surface-dark/60 backdrop-blur-md',
    'border border-border/10 dark:border-border-dark/10',
    'shadow-sm',
    paddingClasses[padding],
    className
  );
  
  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={cn(
          baseClasses, 
          'transition-all hover:bg-white/70 dark:hover:bg-surface-dark/70 active:scale-[0.99] text-left'
        )}
      >
        {children}
      </button>
    );
  }
  
  return <div className={baseClasses}>{children}</div>;
}

