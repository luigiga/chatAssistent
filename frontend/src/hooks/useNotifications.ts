/**
 * Hook para gerenciar notificações com polling
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { listNotifications, markNotificationRead, getUnreadCount, snoozeNotification, type Notification } from '../services/api';
import { useToast } from './use-toast';
import { useQuietHours } from './useQuietHours';

export function useNotifications(
  accessToken: string | null,
  refreshAccessToken?: () => Promise<void>,
  isSheetOpen?: boolean,
) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();
  const { isInQuietHours } = useQuietHours();
  const accumulatedCountRef = useRef<number>(0);
  const wasInQuietHoursRef = useRef<boolean>(false);

  // Função para marcar como lido
  const markAsRead = useCallback(async (id: string) => {
    if (!accessToken) return;
    try {
      await markNotificationRead(
        accessToken,
        id,
        async () => {
          if (refreshAccessToken) {
            await refreshAccessToken();
            return localStorage.getItem('lumeo_access_token') || '';
          }
          return '';
        },
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, [accessToken, refreshAccessToken]);

  // Função para formatar data de snooze
  const formatSnoozeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins} minutos`;
    }
    if (diffHours < 24) {
      return `${diffHours} horas`;
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Função para adiar (snooze) notificação
  const snooze = useCallback(async (
    id: string,
    mode: 'minutes' | 'until' | 'tomorrow_9',
    minutes?: number,
  ) => {
    if (!accessToken) return;
    try {
      const result = await snoozeNotification(
        accessToken,
        id,
        { mode, minutes },
        async () => {
          if (refreshAccessToken) {
            await refreshAccessToken();
            return localStorage.getItem('lumeo_access_token') || '';
          }
          return '';
        },
      );

      // Atualizar estado: remover da lista de não lidas
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Mostrar toast discreto
      toast({
        title: 'Adiado',
        description: `Lembrete reagendado para ${formatSnoozeTime(result.updatedEntitySummary.newDate)}`,
      });
    } catch (error) {
      console.error('Erro ao adiar notificação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adiar o alerta',
        variant: 'destructive',
      });
    }
  }, [accessToken, refreshAccessToken, toast]);

  // Polling a cada 30s
  useEffect(() => {
    if (!accessToken) return;

    const refreshFn = async () => {
      if (refreshAccessToken) {
        await refreshAccessToken();
        return localStorage.getItem('lumeo_access_token') || '';
      }
      return '';
    };

    const fetchNotifications = async () => {
      try {
        const [count, newNotifications] = await Promise.all([
          getUnreadCount(accessToken, refreshFn),
          listNotifications(accessToken, true, refreshFn),
        ]);

        // Detectar novos (não vistos)
        const newIds = newNotifications
          .filter((n) => !seenIdsRef.current.has(n.id))
          .map((n) => n.id);

        const newCount = newIds.length;
        const currentlyInQuietHours = isInQuietHours();

        // Se estava em quiet hours e agora não está: mostrar resumo
        if (wasInQuietHoursRef.current && !currentlyInQuietHours && accumulatedCountRef.current > 0) {
          toast({
            title: 'Resumo',
            description: `Você tem ${accumulatedCountRef.current} novos alertas`,
          });
          accumulatedCountRef.current = 0;
        }

        // Se está em quiet hours: acumular sem toast
        if (currentlyInQuietHours && newCount > 0) {
          accumulatedCountRef.current += newCount;
          // Não mostrar toast
        } else if (newCount > 0 && !isSheetOpen) {
          // Lógica normal de toast (agregado ou individual)
          if (newCount >= 2) {
            // Toast agregado para múltiplas notificações
            toast({
              title: 'Novos alertas',
              description: `Você tem ${newCount} novos alertas`,
            });
          } else {
            // Toast individual para 1 notificação
            const newest = newNotifications.find((n) => newIds.includes(n.id));
            if (newest) {
              toast({
                title: newest.title,
                description: newest.body,
              });
            }
          }
        }

        // Atualizar ref de quiet hours
        wasInQuietHoursRef.current = currentlyInQuietHours;

        // Sempre atualizar seenIds ref e estado (mesmo se sheet aberto)
        newIds.forEach((id) => seenIdsRef.current.add(id));
        setUnreadCount(count);
        setNotifications(newNotifications.slice(0, 30)); // Limitar a 30
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        // Não mostrar erro ao usuário - interface silenciosa
      }
    };

    // Buscar imediatamente
    fetchNotifications();

    // Polling a cada 30s
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [accessToken, refreshAccessToken, toast, isSheetOpen, isInQuietHours]);

  // Interval para verificar saída de quiet hours (1 minuto)
  useEffect(() => {
    if (!accessToken) return;

    const checkQuietHours = () => {
      const currentlyInQuietHours = isInQuietHours();

      // Se saiu de quiet hours e há notificações acumuladas
      if (wasInQuietHoursRef.current && !currentlyInQuietHours && accumulatedCountRef.current > 0) {
        toast({
          title: 'Resumo',
          description: `Você tem ${accumulatedCountRef.current} novos alertas`,
        });
        accumulatedCountRef.current = 0;
      }

      wasInQuietHoursRef.current = currentlyInQuietHours;
    };

    // Verificar apenas se estiver em quiet hours ou acabou de sair
    if (isInQuietHours() || wasInQuietHoursRef.current) {
      const interval = setInterval(checkQuietHours, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [accessToken, isInQuietHours, toast]);

  return { unreadCount, notifications, markAsRead, snooze };
}

