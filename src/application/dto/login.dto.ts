/**
 * DTO para login
 */
import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

