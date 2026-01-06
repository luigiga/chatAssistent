/**
 * App Shell - Container principal premium
 * Define background consistente, container com max-width e ritmo vertical
 */
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export function AppShell({ children, maxWidth = 'max-w-4xl', className = '' }: AppShellProps) {
  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-b from-background via-background to-background/95',
      'dark:from-background-dark dark:via-background-dark dark:to-background-dark/95',
      className
    )}>
      {/* Noise overlay muito sutil */}
      <div className="fixed inset-0 noise-overlay pointer-events-none" />
      <div className={cn('mx-auto px-4 sm:px-6', maxWidth)}>
        {children}
      </div>
    </div>
  );
}

