/**
 * Interface do Repositório de Interação com IA
 * Define o contrato para persistência de interações com IA
 */
import { AIInteraction } from '../../entities/ai-interaction.entity';

export interface AIInteractionRepository {
  /**
   * Cria uma nova interação com IA
   */
  create(interaction: AIInteraction): Promise<AIInteraction>;

  /**
   * Busca uma interação por ID
   */
  findById(id: string): Promise<AIInteraction | null>;

  /**
   * Busca todas as interações de um usuário
   */
  findByUserId(userId: string, limit?: number): Promise<AIInteraction[]>;

  /**
   * Atualiza uma interação (ex: confirmação)
   */
  update(interaction: AIInteraction): Promise<AIInteraction>;
}

