/**
 * Hook para gerenciar Quiet Hours (Modo Silencioso)
 * Permite definir período silencioso onde notificações não disparam toasts
 */
import { useState, useEffect, useCallback } from 'react';

export interface QuietHoursConfig {
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

const STORAGE_KEY = 'lumeo_quiet_hours';

const DEFAULT_CONFIG: QuietHoursConfig = {
  enabled: false,
  startTime: '22:00',
  endTime: '08:00',
};

export function useQuietHours() {
  const [config, setConfig] = useState<QuietHoursConfig>(DEFAULT_CONFIG);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig({
          enabled: parsed.enabled ?? DEFAULT_CONFIG.enabled,
          startTime: parsed.startTime ?? DEFAULT_CONFIG.startTime,
          endTime: parsed.endTime ?? DEFAULT_CONFIG.endTime,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar quiet hours do localStorage:', error);
    }
  }, []);

  // Salvar no localStorage sempre que config mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Erro ao salvar quiet hours no localStorage:', error);
    }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<QuietHoursConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const isInQuietHours = useCallback((): boolean => {
    if (!config.enabled) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Se startTime > endTime, período cruza meia-noite
    if (config.startTime > config.endTime) {
      return currentTime >= config.startTime || currentTime < config.endTime;
    } else {
      return currentTime >= config.startTime && currentTime < config.endTime;
    }
  }, [config]);

  return { config, updateConfig, isInQuietHours };
}

