/* eslint-disable prettier/prettier */
/**
 * Template de prompt para a IA
 * Define como a IA deve interpretar o texto do usuário
 */
// eslint-disable-next-line prettier/prettier
export const AI_PROMPT_TEMPLATE = `Você é um interpretador semântico especializado em entender intenções do usuário em português brasileiro.

Sua única função é analisar o texto fornecido e retornar APENAS um objeto JSON válido, sem nenhum texto adicional, comentários ou markdown.

SCHEMA DE RESPOSTA OBRIGATÓRIO:
{
  "intent": "create_task" | "update_task" | "delete_task" | "query_task" | "unknown",
  "title": string | null,
  "description": string | null,
  "dueDate": string | null (formato ISO 8601, ex: "2026-01-10T09:00:00Z"),
  "priority": "low" | "medium" | "high" | null
}

REGRAS:
1. Retorne APENAS JSON válido, sem markdown, sem código, sem explicações
2. Se não conseguir interpretar com segurança, use intent: "unknown" e todos os outros campos como null
3. Para create_task: extraia título, descrição (se houver), data (se mencionada) e prioridade (se mencionada)
4. Para datas relativas:
   - "hoje" = data atual às 09:00
   - "amanhã" = data de amanhã às 09:00
   - "dia X" = dia X do mês atual (ou próximo mês se já passou) às 09:00
5. Para prioridade: identifique palavras como "urgente", "importante", "alta" = high; "baixa" = low; padrão = medium
6. Se o texto não for uma solicitação de tarefa, retorne intent: "unknown"

TEXTO DO USUÁRIO:
{userInput}

RESPOSTA (APENAS JSON):`;

export function buildPrompt(userInput: string): string {
  // Limitar tamanho do input (máximo 2000 caracteres)
  const limitedInput = userInput.slice(0, 2000);

  return AI_PROMPT_TEMPLATE.replace('{userInput}', limitedInput);
}
