/**
 * Sheet de notificações - Inbox de Alertas
 * UI premium iOS-like
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Bell, ClipboardList, Calendar, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { Notification } from '../../services/api';

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onSnooze: (id: string, mode: 'minutes' | 'until' | 'tomorrow_9', minutes?: number) => Promise<void>;
  onNotificationClick: (notification: Notification) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getIcon(kind: Notification['kind']) {
  switch (kind) {
    case 'TASK_DUE':
      return ClipboardList;
    case 'REMINDER_DUE':
      return Calendar;
    default:
      return Bell;
  }
}

export function NotificationSheet({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onSnooze,
  onNotificationClick,
}: NotificationSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] max-h-[90vh] rounded-t-3xl overflow-hidden bg-white dark:bg-slate-950 p-0 data-[state=open]:backdrop-blur-sm flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/10 dark:border-border-dark/10">
          <SheetTitle className="text-left text-lg font-medium text-text-primary dark:text-text-primary-dark">
            Alertas
          </SheetTitle>
        </SheetHeader>

        {/* Lista de notificações */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bell className="w-12 h-12 text-text-secondary/20 dark:text-text-secondary-dark/20 mx-auto mb-4" />
                <p className="text-sm text-text-secondary/50 dark:text-text-secondary-dark/50">
                  Nenhum alerta no momento
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.kind);
                    const isUnread = !notification.readAt;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="group relative"
                      >
                        <div
                          className={`rounded-2xl p-4 cursor-pointer transition-all ${
                            isUnread
                              ? 'bg-blue-primary/5 dark:bg-blue-primary/10 border border-blue-primary/10'
                              : 'bg-background/50 dark:bg-background-dark/50 border border-border/5 dark:border-border-dark/5'
                          } hover:bg-background dark:hover:bg-background-dark`}
                          onClick={() => onNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                isUnread
                                  ? 'bg-blue-primary/10 text-blue-primary'
                                  : 'bg-background dark:bg-background-dark text-text-secondary/40'
                              }`}
                            >
                              <Icon className="w-5 h-5" strokeWidth={2} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3
                                  className={`text-sm font-medium ${
                                    isUnread
                                      ? 'text-text-primary dark:text-text-primary-dark'
                                      : 'text-text-secondary/70 dark:text-text-secondary-dark/70'
                                  }`}
                                >
                                  {notification.title}
                                </h3>
                                {isUnread && (
                                  <div className="w-2 h-2 rounded-full bg-blue-primary flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-text-secondary/60 dark:text-text-secondary-dark/60 line-clamp-2 mb-2">
                                {notification.body}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-text-secondary/40 dark:text-text-secondary-dark/40">
                                  {formatDate(notification.createdAt)}
                                </span>
                                {isUnread && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        Adiar
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onSnooze(notification.id, 'minutes', 30);
                                        }}
                                      >
                                        30 minutos
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onSnooze(notification.id, 'minutes', 120);
                                        }}
                                      >
                                        2 horas
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onSnooze(notification.id, 'tomorrow_9');
                                        }}
                                      >
                                        Amanhã 09:00
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onMarkAsRead(notification.id);
                                        }}
                                      >
                                        <Check className="w-3 h-3 mr-2" />
                                        Marcar como lido
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

