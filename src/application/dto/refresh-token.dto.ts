/**
 * DTO para refresh token
 */
import { z } from 'zod';

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;

