/**
 * DTO para registro de usuário
 */
import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().optional(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

