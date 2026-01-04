/**
 * Entidade de Tarefa
 * Representa uma tarefa no domínio da aplicação
 * Contém regras de negócio e validações
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class Task {
  private static readonly MIN_TITLE_LENGTH = 1;
  private static readonly MAX_TITLE_LENGTH = 200;
  private static readonly MAX_DESCRIPTION_LENGTH = 2000;

  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly description?: string,
    public readonly completed: boolean = false,
    public readonly dueDate?: Date,
    public readonly priority?: TaskPriority,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly completedAt?: Date,
  ) {
    Task.validateTitle(title);
    if (description) {
      Task.validateDescription(description);
    }
    if (dueDate) {
      Task.validateDueDate(dueDate);
    }
  }

  /**
   * Cria uma nova instância de Task
   * @throws Error se os dados forem inválidos
   */
  static create(
    id: string,
    userId: string,
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: TaskPriority,
  ): Task {
    return new Task(
      id,
      userId,
      title,
      description,
      false,
      dueDate,
      priority,
      new Date(),
      new Date(),
    );
  }

  /**
   * Valida o título da tarefa
   * @throws Error se o título for inválido
   */
  private static validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Título da tarefa não pode estar vazio');
    }
    if (title.length < Task.MIN_TITLE_LENGTH) {
      throw new Error(
        `Título deve ter no mínimo ${Task.MIN_TITLE_LENGTH} caractere(s)`,
      );
    }
    if (title.length > Task.MAX_TITLE_LENGTH) {
      throw new Error(
        `Título deve ter no máximo ${Task.MAX_TITLE_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Valida a descrição da tarefa
   * @throws Error se a descrição for inválida
   */
  private static validateDescription(description: string): void {
    if (description.length > Task.MAX_DESCRIPTION_LENGTH) {
      throw new Error(
        `Descrição deve ter no máximo ${Task.MAX_DESCRIPTION_LENGTH} caracteres`,
      );
    }
  }

  /**
   * Valida a data de vencimento
   * @throws Error se a data for inválida
   */
  private static validateDueDate(dueDate: Date): void {
    if (isNaN(dueDate.getTime())) {
      throw new Error('Data de vencimento inválida');
    }
    // Permite datas no passado (tarefas podem ser criadas retroativamente)
    // Mas podemos adicionar validação se necessário
  }

  /**
   * Marca a tarefa como concluída
   * @throws Error se a tarefa já estiver concluída
   */
  complete(): Task {
    if (this.completed) {
      throw new Error('Tarefa já está concluída');
    }

    return new Task(
      this.id,
      this.userId,
      this.title,
      this.description,
      true,
      this.dueDate,
      this.priority,
      this.createdAt,
      new Date(),
      new Date(),
    );
  }

  /**
   * Marca a tarefa como não concluída
   * @throws Error se a tarefa já estiver não concluída
   */
  uncomplete(): Task {
    if (!this.completed) {
      throw new Error('Tarefa já está não concluída');
    }

    return new Task(
      this.id,
      this.userId,
      this.title,
      this.description,
      false,
      this.dueDate,
      this.priority,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Atualiza os dados da tarefa
   * @throws Error se os dados forem inválidos
   */
  update(
    title?: string,
    description?: string,
    dueDate?: Date,
    priority?: TaskPriority,
  ): Task {
    const newTitle = title ?? this.title;
    const newDescription = description !== undefined ? description : this.description;

    return new Task(
      this.id,
      this.userId,
      newTitle,
      newDescription,
      this.completed,
      dueDate !== undefined ? dueDate : this.dueDate,
      priority !== undefined ? priority : this.priority,
      this.createdAt,
      new Date(),
      this.completedAt,
    );
  }

  /**
   * Verifica se a tarefa está vencida
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.completed) {
      return false;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  }

  /**
   * Verifica se a tarefa vence hoje
   */
  isDueToday(): boolean {
    if (!this.dueDate) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  }

  /**
   * Verifica se a tarefa vence em breve (próximos 3 dias)
   */
  isDueSoon(): boolean {
    if (!this.dueDate || this.completed) {
      return false;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }

  /**
   * Retorna o número de dias até o vencimento
   * Retorna negativo se estiver vencida, null se não tiver data
   */
  getDaysUntilDue(): number | null {
    if (!this.dueDate) {
      return null;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se a tarefa é de alta prioridade
   */
  isHighPriority(): boolean {
    return this.priority === TaskPriority.HIGH;
  }

  /**
   * Verifica se a tarefa pode ser editada
   * (regra de negócio: tarefas concluídas podem ser editadas, mas isso pode variar)
   */
  canBeEdited(): boolean {
    return true; // Por padrão, todas as tarefas podem ser editadas
  }

  /**
   * Verifica se a tarefa pode ser deletada
   */
  canBeDeleted(): boolean {
    return true; // Por padrão, todas as tarefas podem ser deletadas
  }
}

