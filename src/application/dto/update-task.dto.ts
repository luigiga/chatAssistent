/**
 * DTO para atualização de task
 */
import { z } from 'zod';

export const UpdateTaskDtoSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo').optional(),
  description: z
    .string()
    .max(2000, 'Descrição muito longa')
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  dueDate: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((val) => (val === null || val === undefined ? undefined : new Date(val))),
  priority: z.enum(['low', 'medium', 'high']).nullable().optional(),
});

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>;

