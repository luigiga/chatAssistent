/**
 * Entidade de Categoria
 * Representa uma categoria para organizar memórias
 */
export class Category {
  private static readonly MIN_NAME_LENGTH = 1;
  private static readonly MAX_NAME_LENGTH = 50;
  private static readonly COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly color: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    Category.validateName(name);
    Category.validateColor(color);
  }

  /**
   * Cria uma nova instância de Category
   */
  static create(
    id: string,
    userId: string,
    name: string,
    color: string,
  ): Category {
    return new Category(id, userId, name, color, new Date(), new Date());
  }

  /**
   * Reconstrói uma Category a partir de dados persistidos
   */
  static fromPersistence(
    id: string,
    userId: string,
    name: string,
    color: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ): Category {
    return new Category(id, userId, name, color, createdAt, updatedAt);
  }

  /**
   * Valida o nome da categoria
   */
  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome da categoria não pode estar vazio');
    }
    if (name.length < Category.MIN_NAME_LENGTH) {
      throw new Error(
        `Nome deve ter no mínimo ${Category.MIN_NAME_LENGTH} caractere(s)`,
      );
    }
    if (name.length > Category.MAX_NAME_LENGTH) {
      throw new Error(
        `Nome deve ter no máximo ${Category.MAX_NAME_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Valida a cor da categoria (formato hex)
   */
  private static validateColor(color: string): void {
    if (!color || color.trim().length === 0) {
      throw new Error('Cor da categoria não pode estar vazia');
    }
    if (!Category.COLOR_REGEX.test(color)) {
      throw new Error('Cor deve estar no formato hexadecimal (#RRGGBB)');
    }
  }

  /**
   * Atualiza os dados da categoria
   */
  update(name?: string, color?: string): Category {
    const newName = name ?? this.name;
    const newColor = color ?? this.color;

    return new Category(
      this.id,
      this.userId,
      newName,
      newColor,
      this.createdAt,
      new Date(),
    );
  }
}


