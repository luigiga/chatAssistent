/**
 * DTO para query de listagem de tasks
 */
import { z } from 'zod';

export const ListTasksQueryDtoSchema = z.object({
  completed: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().positive().max(100)),
});

export type ListTasksQueryDto = z.infer<typeof ListTasksQueryDtoSchema>;

