/**
 * DTO para criação de reminder
 */
import { z } from 'zod';

export const CreateReminderDtoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(2000, 'Descrição muito longa').optional(),
  reminderDate: z.string().datetime('Data inválida'),
  isRecurring: z.boolean().optional().default(false),
  recurrenceRule: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

export type CreateReminderDto = z.infer<typeof CreateReminderDtoSchema>;

