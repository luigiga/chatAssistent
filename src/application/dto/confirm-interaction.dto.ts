/**
 * DTO para confirmar uma interação
 */
import { z } from 'zod';

export const ConfirmInteractionDtoSchema = z.object({
  interactionId: z.string().uuid('ID da interação inválido'),
});

export type ConfirmInteractionDto = z.infer<typeof ConfirmInteractionDtoSchema>;

