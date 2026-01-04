/**
 * Entidade de Refresh Token
 * Representa um token de refresh para autenticação rotacionável
 */
export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt?: Date,
    public readonly revokedAt?: Date,
  ) {}

  /**
   * Cria uma nova instância de RefreshToken
   */
  static create(
    id: string,
    token: string,
    userId: string,
    expiresAt: Date,
  ): RefreshToken {
    return new RefreshToken(id, token, userId, expiresAt, new Date());
  }

  /**
   * Verifica se o token está expirado
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Verifica se o token foi revogado
   */
  isRevoked(): boolean {
    return this.revokedAt !== undefined;
  }

  /**
   * Verifica se o token é válido (não expirado e não revogado)
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }

  /**
   * Revoga o token
   */
  revoke(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.token,
      this.userId,
      this.expiresAt,
      this.createdAt,
      new Date(),
    );
  }
}

