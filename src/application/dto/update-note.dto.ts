/**
 * DTO para atualização de note
 */
import { z } from 'zod';

export const UpdateNoteDtoSchema = z.object({
  title: z.string().max(200, 'Título muito longo').optional().nullable(),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(10000, 'Conteúdo muito longo').optional(),
});

export type UpdateNoteDto = z.infer<typeof UpdateNoteDtoSchema>;

