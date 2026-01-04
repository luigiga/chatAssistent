/**
 * Interface do Repositório de Refresh Token
 * Define o contrato para persistência de refresh tokens
 */
import { RefreshToken } from '../../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  /**
   * Cria um novo refresh token
   */
  create(token: RefreshToken): Promise<RefreshToken>;

  /**
   * Busca um refresh token pelo token string
   */
  findByToken(token: string): Promise<RefreshToken | null>;

  /**
   * Busca todos os refresh tokens de um usuário
   */
  findByUserId(userId: string): Promise<RefreshToken[]>;

  /**
   * Revoga um refresh token
   */
  revoke(token: string): Promise<void>;

  /**
   * Revoga todos os refresh tokens de um usuário
   */
  revokeAllByUserId(userId: string): Promise<void>;

  /**
   * Remove tokens expirados
   */
  deleteExpired(): Promise<void>;
}

