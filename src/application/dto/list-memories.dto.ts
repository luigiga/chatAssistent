/**
 * DTO para listar memórias
 */
import { z } from 'zod';

export const ListMemoriesDtoSchema = z.object({
  space: z.enum(['reminders', 'today', 'thisWeek', 'ideas', 'routine', 'favorites', 'older', 'all']).optional().default('all'),
});

export type ListMemoriesDto = z.infer<typeof ListMemoriesDtoSchema>;

