/**
 * Value Object para Email
 * Garante que o email seja válido
 */
export class Email {
  private static readonly EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {
    if (!Email.isValid(value)) {
      throw new Error('Email inválido');
    }
  }

  /**
   * Cria uma instância de Email
   * @throws Error se o email for inválido
   */
  static create(value: string): Email {
    return new Email(value);
  }

  /**
   * Verifica se o email é válido
   */
  static isValid(value: string): boolean {
    return Email.EMAIL_REGEX.test(value);
  }

  /**
   * Retorna o valor do email
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara dois emails
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

