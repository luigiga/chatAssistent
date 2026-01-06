/**
 * Observation Item - Card discreto para observação
 * Visual de "camada viva" com timestamp discreto
 */
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface ObservationItemProps {
  text: string;
  timestamp: Date;
  index: number;
}

function formatTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ObservationItem({ text, timestamp, index }: ObservationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ 
        duration: 0.45, 
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1] 
      }}
      layout
    >
      <GlassCard padding="md" className="text-left">
        <p className="text-base text-text-primary dark:text-text-primary-dark leading-relaxed mb-3" style={{ lineHeight: '1.7', fontWeight: 400 }}>
          {text}
        </p>
        <p className="text-xs text-text-secondary/35 dark:text-text-secondary-dark/35" style={{ letterSpacing: '0.02em' }}>
          {formatTime(timestamp)}
        </p>
      </GlassCard>
    </motion.div>
  );
}

