/**
 * Validador Zod para resposta da IA
 * Garante que a resposta da IA está no formato esperado
 */
import { z } from 'zod';

/**
 * Schema da resposta bruta da IA
 * Este é o formato que a IA deve retornar
 */
export const AIResponseSchema = z.object({
  intent: z.enum(['create_task', 'update_task', 'delete_task', 'query_task', 'unknown']),
  title: z.string().nullable(),
  description: z.string().nullable(),
  dueDate: z.string().nullable().refine(
    (val) => {
      if (val === null) return true;
      // Validar formato ISO 8601
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'dueDate deve ser uma data válida em formato ISO 8601' }
  ),
  priority: z.enum(['low', 'medium', 'high']).nullable(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

/**
 * Valida e sanitiza a resposta da IA
 * @param rawResponse Resposta bruta da IA (string ou objeto)
 * @returns Resposta validada e sanitizada
 * @throws Error se a validação falhar
 */
export function validateAIResponse(rawResponse: unknown): AIResponse {
  let parsed: unknown;

  // Se for string, tentar fazer parse JSON
  if (typeof rawResponse === 'string') {
    try {
      // Remover markdown code blocks se existirem
      const cleaned = rawResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      parsed = JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Resposta da IA não é JSON válido: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  } else {
    parsed = rawResponse;
  }

  // Validar com Zod
  try {
    return AIResponseSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Resposta da IA inválida: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

