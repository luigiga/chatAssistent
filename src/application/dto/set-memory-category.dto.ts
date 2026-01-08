/**
 * DTO para atribuir categoria a memória
 */
import { z } from 'zod';

export const SetMemoryCategoryDtoSchema = z.object({
  categoryId: z.string().uuid('ID de categoria inválido').nullable().optional(),
});

export type SetMemoryCategoryDto = z.infer<typeof SetMemoryCategoryDtoSchema>;


