/**
 * Testes unitários do Value Object Recurrence
 */
import { Recurrence, RecurrenceType } from './recurrence.vo';

describe('Recurrence Value Object', () => {
  const startDate = new Date('2024-01-01T10:00:00Z');

  describe('create', () => {
    it('deve criar uma recorrência diária', () => {
      const recurrence = Recurrence.create(RecurrenceType.DAILY, startDate);
      expect(recurrence.getType()).toBe(RecurrenceType.DAILY);
      expect(recurrence.getStartDate()).toEqual(startDate);
    });

    it('deve criar uma recorrência semanal', () => {
      const recurrence = Recurrence.create(RecurrenceType.WEEKLY, startDate);
      expect(recurrence.getType()).toBe(RecurrenceType.WEEKLY);
    });

    it('deve criar uma recorrência mensal', () => {
      const recurrence = Recurrence.create(RecurrenceType.MONTHLY, startDate);
      expect(recurrence.getType()).toBe(RecurrenceType.MONTHLY);
    });

    it('deve criar uma recorrência anual', () => {
      const recurrence = Recurrence.create(RecurrenceType.YEARLY, startDate);
      expect(recurrence.getType()).toBe(RecurrenceType.YEARLY);
    });
  });

  describe('isValidType', () => {
    it('deve validar tipos corretamente', () => {
      expect(Recurrence.isValidType('daily')).toBe(true);
      expect(Recurrence.isValidType('weekly')).toBe(true);
      expect(Recurrence.isValidType('monthly')).toBe(true);
      expect(Recurrence.isValidType('yearly')).toBe(true);
      expect(Recurrence.isValidType('invalid')).toBe(false);
    });
  });

  describe('getNextDate', () => {
    it('deve calcular próxima data para recorrência diária', () => {
      const recurrence = Recurrence.create(RecurrenceType.DAILY, startDate);
      const baseDate = new Date('2024-01-05T10:00:00Z');
      const nextDate = recurrence.getNextDate(baseDate);

      const expected = new Date('2024-01-06T10:00:00Z');
      expect(nextDate.getTime()).toBe(expected.getTime());
    });

    it('deve calcular próxima data para recorrência semanal', () => {
      const recurrence = Recurrence.create(RecurrenceType.WEEKLY, startDate);
      const baseDate = new Date('2024-01-05T10:00:00Z');
      const nextDate = recurrence.getNextDate(baseDate);

      const expected = new Date('2024-01-12T10:00:00Z');
      expect(nextDate.getTime()).toBe(expected.getTime());
    });

    it('deve calcular próxima data para recorrência mensal', () => {
      const recurrence = Recurrence.create(RecurrenceType.MONTHLY, startDate);
      const baseDate = new Date('2024-01-05T10:00:00Z');
      const nextDate = recurrence.getNextDate(baseDate);

      const expected = new Date('2024-02-05T10:00:00Z');
      expect(nextDate.getTime()).toBe(expected.getTime());
    });

    it('deve calcular próxima data para recorrência anual', () => {
      const recurrence = Recurrence.create(RecurrenceType.YEARLY, startDate);
      const baseDate = new Date('2024-01-05T10:00:00Z');
      const nextDate = recurrence.getNextDate(baseDate);

      const expected = new Date('2025-01-05T10:00:00Z');
      expect(nextDate.getTime()).toBe(expected.getTime());
    });
  });

  describe('getOccurrencesUntil', () => {
    it('deve retornar ocorrências diárias até uma data limite', () => {
      const recurrence = Recurrence.create(RecurrenceType.DAILY, startDate);
      const limitDate = new Date('2024-01-05T10:00:00Z');
      const occurrences = recurrence.getOccurrencesUntil(startDate, limitDate);

      expect(occurrences).toHaveLength(5);
      expect(occurrences[0].getTime()).toBe(startDate.getTime());
      expect(occurrences[4].getTime()).toBe(limitDate.getTime());
    });

    it('deve respeitar o limite máximo de ocorrências', () => {
      const recurrence = Recurrence.create(RecurrenceType.DAILY, startDate);
      const limitDate = new Date('2025-01-01T10:00:00Z');
      const occurrences = recurrence.getOccurrencesUntil(
        startDate,
        limitDate,
        10,
      );

      expect(occurrences).toHaveLength(10);
    });

    it('deve retornar ocorrências semanais', () => {
      const recurrence = Recurrence.create(RecurrenceType.WEEKLY, startDate);
      const limitDate = new Date('2024-01-22T10:00:00Z');
      const occurrences = recurrence.getOccurrencesUntil(startDate, limitDate);

      expect(occurrences.length).toBeGreaterThan(0);
      expect(occurrences[0].getTime()).toBe(startDate.getTime());
    });
  });

  describe('isOccurrence', () => {
    it('deve identificar ocorrências válidas para recorrência diária', () => {
      const recurrence = Recurrence.create(RecurrenceType.DAILY, startDate);

      expect(recurrence.isOccurrence(new Date('2024-01-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-01-02T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2023-12-31T10:00:00Z'))).toBe(
        false,
      );
    });

    it('deve identificar ocorrências válidas para recorrência semanal', () => {
      const recurrence = Recurrence.create(RecurrenceType.WEEKLY, startDate);

      expect(recurrence.isOccurrence(new Date('2024-01-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-01-08T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-01-05T10:00:00Z'))).toBe(
        false,
      );
    });

    it('deve identificar ocorrências válidas para recorrência mensal', () => {
      const recurrence = Recurrence.create(RecurrenceType.MONTHLY, startDate);

      expect(recurrence.isOccurrence(new Date('2024-01-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-02-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-01-15T10:00:00Z'))).toBe(
        false,
      );
    });

    it('deve identificar ocorrências válidas para recorrência anual', () => {
      const recurrence = Recurrence.create(RecurrenceType.YEARLY, startDate);

      expect(recurrence.isOccurrence(new Date('2024-01-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2025-01-01T10:00:00Z'))).toBe(
        true,
      );
      expect(recurrence.isOccurrence(new Date('2024-06-01T10:00:00Z'))).toBe(
        false,
      );
    });
  });

  describe('equals', () => {
    it('deve comparar duas recorrências iguais', () => {
      const recurrence1 = Recurrence.create(RecurrenceType.DAILY, startDate);
      const recurrence2 = Recurrence.create(RecurrenceType.DAILY, startDate);

      expect(recurrence1.equals(recurrence2)).toBe(true);
    });

    it('deve identificar recorrências diferentes', () => {
      const recurrence1 = Recurrence.create(RecurrenceType.DAILY, startDate);
      const recurrence2 = Recurrence.create(RecurrenceType.WEEKLY, startDate);
      const recurrence3 = Recurrence.create(
        RecurrenceType.DAILY,
        new Date('2024-01-02T10:00:00Z'),
      );

      expect(recurrence1.equals(recurrence2)).toBe(false);
      expect(recurrence1.equals(recurrence3)).toBe(false);
    });
  });
});

