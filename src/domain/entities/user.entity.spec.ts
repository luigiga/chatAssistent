/**
 * Testes unitários da entidade User
 * Exemplo de como testar o domínio
 */
import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('deve criar um usuário com sucesso', () => {
      const user = User.create(
        '123',
        'test@example.com',
        'hashedPassword',
        'Test User',
      );

      expect(user.id).toBe('123');
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedPassword');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar um usuário sem nome', () => {
      const user = User.create(
        '123',
        'test@example.com',
        'hashedPassword',
      );

      expect(user.name).toBeUndefined();
    });
  });

  describe('updateName', () => {
    it('deve atualizar o nome do usuário', () => {
      const user = User.create(
        '123',
        'test@example.com',
        'hashedPassword',
        'Old Name',
      );

      const updatedUser = user.updateName('New Name');

      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.updatedAt?.getTime()).toBeGreaterThanOrEqual(
        user.updatedAt?.getTime() || 0,
      );
    });
  });
});

