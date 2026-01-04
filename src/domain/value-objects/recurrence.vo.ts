/**
 * Value Object para Recurrence (Recorrência)
 * Gerencia regras de negócio para lembretes recorrentes
 */
export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class Recurrence {
  private constructor(
    private readonly type: RecurrenceType,
    private readonly startDate: Date,
  ) {
    if (!Recurrence.isValidType(type)) {
      throw new Error('Tipo de recorrência inválido');
    }
  }

  /**
   * Cria uma instância de Recurrence
   * @throws Error se o tipo for inválido
   */
  static create(type: RecurrenceType, startDate: Date): Recurrence {
    return new Recurrence(type, startDate);
  }

  /**
   * Verifica se o tipo de recorrência é válido
   */
  static isValidType(type: string): type is RecurrenceType {
    return Object.values(RecurrenceType).includes(type as RecurrenceType);
  }

  /**
   * Retorna o tipo de recorrência
   */
  getType(): RecurrenceType {
    return this.type;
  }

  /**
   * Retorna a data de início
   */
  getStartDate(): Date {
    return new Date(this.startDate);
  }

  /**
   * Calcula a próxima data de recorrência a partir de uma data base
   * @param baseDate Data base para calcular a próxima ocorrência
   * @returns Próxima data de recorrência
   */
  getNextDate(baseDate: Date): Date {
    const nextDate = new Date(baseDate);

    switch (this.type) {
      case RecurrenceType.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case RecurrenceType.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case RecurrenceType.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case RecurrenceType.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  /**
   * Calcula todas as ocorrências futuras até uma data limite
   * @param baseDate Data base
   * @param limitDate Data limite
   * @param maxOccurrences Número máximo de ocorrências (padrão: 100)
   * @returns Array de datas de ocorrências
   */
  getOccurrencesUntil(
    baseDate: Date,
    limitDate: Date,
    maxOccurrences: number = 100,
  ): Date[] {
    const occurrences: Date[] = [];
    let currentDate = new Date(baseDate);
    let count = 0;

    while (currentDate <= limitDate && count < maxOccurrences) {
      occurrences.push(new Date(currentDate));
      currentDate = this.getNextDate(currentDate);
      count++;
    }

    return occurrences;
  }

  /**
   * Verifica se uma data corresponde a uma ocorrência válida desta recorrência
   * @param date Data a verificar
   * @returns true se a data é uma ocorrência válida
   */
  isOccurrence(date: Date): boolean {
    if (date < this.startDate) {
      return false;
    }

    const diffTime = date.getTime() - this.startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    switch (this.type) {
      case RecurrenceType.DAILY:
        return diffDays >= 0;
      case RecurrenceType.WEEKLY:
        return diffDays >= 0 && diffDays % 7 === 0;
      case RecurrenceType.MONTHLY:
        return (
          diffDays >= 0 &&
          date.getDate() === this.startDate.getDate()
        );
      case RecurrenceType.YEARLY:
        return (
          diffDays >= 0 &&
          date.getMonth() === this.startDate.getMonth() &&
          date.getDate() === this.startDate.getDate()
        );
      default:
        return false;
    }
  }

  /**
   * Compara duas recorrências
   */
  equals(other: Recurrence): boolean {
    return (
      this.type === other.type &&
      this.startDate.getTime() === other.startDate.getTime()
    );
  }
}

