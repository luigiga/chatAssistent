/**
 * Interface para serviço de hash de senhas
 */
export interface PasswordHasher {
  /**
   * Gera hash de uma senha
   */
  hash(password: string): Promise<string>;

  /**
   * Verifica se uma senha corresponde a um hash
   */
  verify(password: string, hash: string): Promise<boolean>;
}

