/**
 * Page Transition - Transição suave entre páginas
 * Fade + slide com easing suave (iOS-like)
 */
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  key?: string;
}

export function PageTransition({ children, key }: PageTransitionProps) {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] // Easing mais suave e natural
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

