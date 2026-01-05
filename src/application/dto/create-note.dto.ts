/**
 * DTO para criação de note
 */
import { z } from 'zod';

export const CreateNoteDtoSchema = z.object({
  title: z.string().max(200, 'Título muito longo').optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório').max(10000, 'Conteúdo muito longo'),
});

export type CreateNoteDto = z.infer<typeof CreateNoteDtoSchema>;

