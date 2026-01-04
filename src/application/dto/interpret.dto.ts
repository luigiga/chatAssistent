/**
 * DTO para interpretação de mensagem
 */
import { z } from 'zod';

export const InterpretDtoSchema = z.object({
  text: z.string().min(1, 'Texto não pode estar vazio'),
});

export type InterpretDto = z.infer<typeof InterpretDtoSchema>;

