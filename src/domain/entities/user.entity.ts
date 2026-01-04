/**
 * Entidade de Usuário
 * Representa um usuário no domínio da aplicação
 * Não possui dependências de framework
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Cria uma nova instância de User
   */
  static create(
    id: string,
    email: string,
    passwordHash: string,
    name?: string,
  ): User {
    return new User(id, email, passwordHash, name, new Date(), new Date());
  }

  /**
   * Atualiza o nome do usuário
   */
  updateName(name: string): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      name,
      this.createdAt,
      new Date(),
    );
  }
}

