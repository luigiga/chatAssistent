/**
 * Interface do Repositório de Usuário
 * Define o contrato para persistência de usuários
 * O domínio não conhece a implementação concreta
 */
import { User } from '../../entities/user.entity';

export interface UserRepository {
  /**
   * Cria um novo usuário
   */
  create(user: User): Promise<User>;

  /**
   * Busca um usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Atualiza um usuário existente
   */
  update(user: User): Promise<User>;

  /**
   * Remove um usuário
   */
  delete(id: string): Promise<void>;
}

