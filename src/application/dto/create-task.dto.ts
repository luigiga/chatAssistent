/**
 * DTO para criação de task
 */
import { z } from 'zod';

export const CreateTaskDtoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(2000, 'Descrição muito longa').optional(),
  dueDate: z.string().datetime().optional().transform((val) => (val ? new Date(val) : undefined)),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

