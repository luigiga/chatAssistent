/**
 * Entidade de Lembrete
 * Representa um lembrete no domínio da aplicação
 */
export enum RecurrenceRule {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class Reminder {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly reminderDate: Date,
    public readonly description?: string,
    public readonly isRecurring: boolean = false,
    public readonly recurrenceRule?: RecurrenceRule,
    public readonly completed: boolean = false,
    public readonly isFavorite: boolean = false,
    public readonly isPinned: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly completedAt?: Date,
  ) {}

  /**
   * Cria uma nova instância de Reminder
   */
  static create(
    id: string,
    userId: string,
    title: string,
    reminderDate: Date,
    description?: string,
    isRecurring: boolean = false,
    recurrenceRule?: RecurrenceRule,
  ): Reminder {
    return new Reminder(
      id,
      userId,
      title,
      reminderDate,
      description,
      isRecurring,
      recurrenceRule,
      false, // completed
      false, // isFavorite
      false, // isPinned
      new Date(),
      new Date(),
    );
  }

  /**
   * Marca o lembrete como concluído
   */
  complete(): Reminder {
    return new Reminder(
      this.id,
      this.userId,
      this.title,
      this.reminderDate,
      this.description,
      this.isRecurring,
      this.recurrenceRule,
      true,
      this.isFavorite,
      this.isPinned,
      this.createdAt,
      new Date(),
      new Date(),
    );
  }

  /**
   * Atualiza os dados do lembrete
   */
  update(
    title?: string,
    description?: string,
    reminderDate?: Date,
    isRecurring?: boolean,
    recurrenceRule?: RecurrenceRule,
  ): Reminder {
    return new Reminder(
      this.id,
      this.userId,
      title ?? this.title,
      reminderDate ?? this.reminderDate,
      description !== undefined ? description : this.description,
      isRecurring !== undefined ? isRecurring : this.isRecurring,
      recurrenceRule !== undefined ? recurrenceRule : this.recurrenceRule,
      this.completed,
      this.isFavorite,
      this.isPinned,
      this.createdAt,
      new Date(),
      this.completedAt,
    );
  }

  toggleFavorite(): Reminder {
    return new Reminder(
      this.id,
      this.userId,
      this.title,
      this.reminderDate,
      this.description,
      this.isRecurring,
      this.recurrenceRule,
      this.completed,
      !this.isFavorite,
      this.isPinned,
      this.createdAt,
      new Date(),
      this.completedAt,
    );
  }

  togglePin(): Reminder {
    return new Reminder(
      this.id,
      this.userId,
      this.title,
      this.reminderDate,
      this.description,
      this.isRecurring,
      this.recurrenceRule,
      this.completed,
      this.isFavorite,
      !this.isPinned,
      this.createdAt,
      new Date(),
      this.completedAt,
    );
  }
}

