/**
 * Testes unitários do Value Object Email
 */
import { Email } from './email.vo';

describe('Email Value Object', () => {
  describe('create', () => {
    it('deve criar um email válido', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('deve lançar erro para email inválido', () => {
      expect(() => Email.create('invalid-email')).toThrow('Email inválido');
      expect(() => Email.create('test@')).toThrow('Email inválido');
      expect(() => Email.create('@example.com')).toThrow('Email inválido');
      expect(() => Email.create('test.example.com')).toThrow('Email inválido');
    });
  });

  describe('isValid', () => {
    it('deve validar emails corretamente', () => {
      expect(Email.isValid('test@example.com')).toBe(true);
      expect(Email.isValid('user.name@domain.co.uk')).toBe(true);
      expect(Email.isValid('invalid-email')).toBe(false);
      expect(Email.isValid('test@')).toBe(false);
    });
  });

  describe('equals', () => {
    it('deve comparar dois emails corretamente', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      const email3 = Email.create('other@example.com');

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });
  });
});

