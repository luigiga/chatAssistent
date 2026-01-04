/**
 * Entidade de Interação com IA
 * Representa uma interação com o provider de IA
 */
export class AIInteraction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly userInput: string,
    public readonly aiResponse: string, // JSON string da resposta da IA
    public readonly needsConfirmation: boolean = false,
    public readonly confirmed?: boolean,
    public readonly createdAt?: Date,
  ) {}

  /**
   * Cria uma nova instância de AIInteraction
   */
  static create(
    id: string,
    userId: string,
    userInput: string,
    aiResponse: string,
    needsConfirmation: boolean = false,
  ): AIInteraction {
    return new AIInteraction(
      id,
      userId,
      userInput,
      aiResponse,
      needsConfirmation,
      undefined,
      new Date(),
    );
  }

  /**
   * Confirma a interação
   */
  confirm(): AIInteraction {
    return new AIInteraction(
      this.id,
      this.userId,
      this.userInput,
      this.aiResponse,
      this.needsConfirmation,
      true,
      this.createdAt,
    );
  }

  /**
   * Rejeita a interação
   */
  reject(): AIInteraction {
    return new AIInteraction(
      this.id,
      this.userId,
      this.userInput,
      this.aiResponse,
      this.needsConfirmation,
      false,
      this.createdAt,
    );
  }
}

