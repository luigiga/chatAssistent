/**
 * Componente de sino de notificações com badge
 */
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

export function NotificationBell({ unreadCount, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-background/50 dark:hover:bg-background-dark/50 transition-colors"
      aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
    >
      <Bell className="w-5 h-5 text-text-primary dark:text-text-primary-dark" strokeWidth={2} />
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 w-4 h-4 bg-blue-primary rounded-full flex items-center justify-center"
        >
          <span className="text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </motion.div>
      )}
    </button>
  );
}

