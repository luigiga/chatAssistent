/**
 * DTO para busca de memórias
 */
import { z } from 'zod';

export const SearchMemoriesDtoSchema = z.object({
  q: z.string().min(2, 'Busca deve ter no mínimo 2 caracteres'),
  types: z.array(z.enum(['task', 'note', 'reminder'])).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  status: z.enum(['open', 'done']).optional(),
});

export type SearchMemoriesDto = z.infer<typeof SearchMemoriesDtoSchema>;
