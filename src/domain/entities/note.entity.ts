/**
 * Entidade de Nota
 * Representa uma nota no domínio da aplicação
 * Contém regras de negócio e validações
 */
export class Note {
  private static readonly MIN_CONTENT_LENGTH = 1;
  private static readonly MAX_CONTENT_LENGTH = 10000;
  private static readonly MAX_TITLE_LENGTH = 200;

  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly title?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    Note.validateContent(content);
    if (title) {
      Note.validateTitle(title);
    }
  }

  /**
   * Cria uma nova instância de Note
   * @throws Error se os dados forem inválidos
   */
  static create(
    id: string,
    userId: string,
    content: string,
    title?: string,
  ): Note {
    return new Note(id, userId, content, title, new Date(), new Date());
  }

  /**
   * Valida o conteúdo da nota
   * @throws Error se o conteúdo for inválido
   */
  private static validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Conteúdo da nota não pode estar vazio');
    }
    if (content.length < Note.MIN_CONTENT_LENGTH) {
      throw new Error(
        `Conteúdo deve ter no mínimo ${Note.MIN_CONTENT_LENGTH} caractere(s)`,
      );
    }
    if (content.length > Note.MAX_CONTENT_LENGTH) {
      throw new Error(
        `Conteúdo deve ter no máximo ${Note.MAX_CONTENT_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Valida o título da nota
   * @throws Error se o título for inválido
   */
  private static validateTitle(title: string): void {
    if (title.trim().length === 0) {
      throw new Error('Título da nota não pode estar vazio');
    }
    if (title.length > Note.MAX_TITLE_LENGTH) {
      throw new Error(
        `Título deve ter no máximo ${Note.MAX_TITLE_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Atualiza o conteúdo da nota
   * @throws Error se os dados forem inválidos
   */
  update(content?: string, title?: string): Note {
    const newContent = content ?? this.content;
    const newTitle = title !== undefined ? title : this.title;

    return new Note(
      this.id,
      this.userId,
      newContent,
      newTitle,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Verifica se a nota tem título
   */
  hasTitle(): boolean {
    return this.title !== undefined && this.title.trim().length > 0;
  }

  /**
   * Retorna o tamanho do conteúdo em caracteres
   */
  getContentLength(): number {
    return this.content.length;
  }

  /**
   * Retorna uma prévia do conteúdo (primeiros N caracteres)
   */
  getPreview(maxLength: number = 100): string {
    if (this.content.length <= maxLength) {
      return this.content;
    }
    return this.content.substring(0, maxLength) + '...';
  }

  /**
   * Verifica se a nota está vazia (apenas espaços em branco)
   */
  isEmpty(): boolean {
    return this.content.trim().length === 0;
  }

  /**
   * Verifica se a nota pode ser editada
   */
  canBeEdited(): boolean {
    return true;
  }

  /**
   * Verifica se a nota pode ser deletada
   */
  canBeDeleted(): boolean {
    return true;
  }
}

