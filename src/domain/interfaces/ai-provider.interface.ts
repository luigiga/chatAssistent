/**
 * Interface para o Provider de IA
 * Define o contrato que qualquer provider de IA deve implementar
 * O domínio não conhece a implementação concreta
 */

/**
 * Estrutura da resposta esperada da IA
 * A IA deve retornar uma estrutura JSON válida com estas informações
 */
export interface AIInterpretationResponse {
  /**
   * Indica se a ação precisa de confirmação do usuário
   */
  needs_confirmation: boolean;

  /**
   * Tipo de ação identificada
   */
  action_type: 'task' | 'note' | 'reminder' | 'unknown';

  /**
   * Dados da tarefa (se action_type for 'task')
   */
  task?: {
    title: string;
    description?: string;
    due_date?: string; // ISO 8601 format
    priority?: 'low' | 'medium' | 'high';
  };

  /**
   * Dados da nota (se action_type for 'note')
   */
  note?: {
    title?: string;
    content: string;
  };

  /**
   * Dados do lembrete (se action_type for 'reminder')
   */
  reminder?: {
    title: string;
    description?: string;
    reminder_date: string; // ISO 8601 format
    is_recurring?: boolean;
    recurrence_rule?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };

  /**
   * Mensagem de confirmação (se needs_confirmation for true)
   */
  confirmation_message?: string;
}

/**
 * Interface do Provider de IA
 * Qualquer implementação deve seguir este contrato
 */
export interface AIProvider {
  /**
   * Interpreta uma mensagem em linguagem natural e retorna uma estrutura estruturada
   * @param userInput Texto do usuário em linguagem natural (PT-BR)
   * @returns Promise com a interpretação estruturada
   * @throws Error se houver falha na comunicação com a IA
   */
  interpret(userInput: string): Promise<AIInterpretationResponse>;
}

