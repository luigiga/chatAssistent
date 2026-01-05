/**
 * DTO para rejeitar uma interação
 */
import { z } from 'zod';

export const RejectInteractionDtoSchema = z.object({
  interactionId: z.string().uuid('ID da interação inválido'),
});

export type RejectInteractionDto = z.infer<typeof RejectInteractionDtoSchema>;

