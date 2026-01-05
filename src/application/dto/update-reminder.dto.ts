/**
 * DTO para atualização de reminder
 */
import { z } from 'zod';

export const UpdateReminderDtoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo').optional(),
  description: z.string().max(2000, 'Descrição muito longa').optional().nullable(),
  reminderDate: z.string().datetime('Data inválida').optional(),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
});

export type UpdateReminderDto = z.infer<typeof UpdateReminderDtoSchema>;

