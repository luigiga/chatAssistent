/**
 * Value Object para Password
 * Não armazena a senha em si, apenas valida regras
 * A senha deve ser hasheada antes de ser armazenada
 */
export class Password {
  private static readonly MIN_LENGTH = 8;

  private constructor(private readonly value: string) {
    if (!Password.isValid(value)) {
      throw new Error(
        `Senha deve ter no mínimo ${Password.MIN_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Cria uma instância de Password
   * @throws Error se a senha não atender aos critérios
   */
  static create(value: string): Password {
    return new Password(value);
  }

  /**
   * Verifica se a senha é válida
   */
  static isValid(value: string): boolean {
    return value.length >= Password.MIN_LENGTH;
  }

  /**
   * Retorna o valor da senha (apenas para hashing)
   * ATENÇÃO: Nunca logar ou retornar este valor
   */
  getValue(): string {
    return this.value;
  }
}

