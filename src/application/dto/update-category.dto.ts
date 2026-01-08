/**
 * DTO para atualizar categoria
 */
import { z } from 'zod';

export const UpdateCategoryDtoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)').optional(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;


