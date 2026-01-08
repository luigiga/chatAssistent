/**
 * DTO para adiar (snooze) uma notificação
 */
import { z } from 'zod';

export const SnoozeNotificationDtoSchema = z.object({
  mode: z.enum(['minutes', 'until', 'tomorrow_9']),
  minutes: z.number().int().positive().optional(),
  until: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.mode === 'minutes' && !data.minutes) return false;
    if (data.mode === 'until' && !data.until) return false;
    return true;
  },
  { message: 'Parâmetros inválidos para o modo selecionado' }
);

export type SnoozeNotificationDto = z.infer<typeof SnoozeNotificationDtoSchema>;

