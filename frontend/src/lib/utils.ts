import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes Tailwind CSS
 * Garante que classes conflitantes sejam resolvidas corretamente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

