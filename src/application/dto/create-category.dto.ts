/**
 * DTO para criar categoria
 */
import { z } from 'zod';

export const CreateCategoryDtoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)'),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;


