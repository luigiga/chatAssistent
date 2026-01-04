/**
 * Testes unitários da entidade Task
 */
import { Task, TaskPriority } from './task.entity';

describe('Task Entity', () => {
  describe('create', () => {
    it('deve criar uma tarefa com sucesso', () => {
      const task = Task.create(
        '123',
        'user-123',
        'Minha Tarefa',
        'Descrição da tarefa',
        new Date('2024-12-31'),
        TaskPriority.HIGH,
      );

      expect(task.id).toBe('123');
      expect(task.userId).toBe('user-123');
      expect(task.title).toBe('Minha Tarefa');
      expect(task.description).toBe('Descrição da tarefa');
      expect(task.completed).toBe(false);
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('deve criar uma tarefa sem descrição e prioridade', () => {
      const task = Task.create('123', 'user-123', 'Tarefa Simples');

      expect(task.title).toBe('Tarefa Simples');
      expect(task.description).toBeUndefined();
      expect(task.priority).toBeUndefined();
    });

    it('deve lançar erro se título estiver vazio', () => {
      expect(() => {
        Task.create('123', 'user-123', '');
      }).toThrow('Título da tarefa não pode estar vazio');
    });

    it('deve lançar erro se título tiver apenas espaços', () => {
      expect(() => {
        Task.create('123', 'user-123', '   ');
      }).toThrow('Título da tarefa não pode estar vazio');
    });

    it('deve lançar erro se título for muito longo', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => {
        Task.create('123', 'user-123', longTitle);
      }).toThrow('Título deve ter no máximo 200 caracteres');
    });

    it('deve lançar erro se descrição for muito longa', () => {
      const longDescription = 'a'.repeat(2001);
      expect(() => {
        Task.create('123', 'user-123', 'Tarefa', longDescription);
      }).toThrow('Descrição deve ter no máximo 2000 caracteres');
    });
  });

  describe('complete', () => {
    it('deve marcar a tarefa como concluída', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      const completedTask = task.complete();

      expect(completedTask.completed).toBe(true);
      expect(completedTask.completedAt).toBeInstanceOf(Date);
      expect(completedTask.id).toBe(task.id);
      expect(completedTask.updatedAt!.getTime()).toBeGreaterThanOrEqual(
        task.updatedAt!.getTime(),
      );
    });

    it('deve lançar erro se tentar completar tarefa já concluída', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      const completedTask = task.complete();

      expect(() => {
        completedTask.complete();
      }).toThrow('Tarefa já está concluída');
    });
  });

  describe('uncomplete', () => {
    it('deve marcar a tarefa como não concluída', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      const completedTask = task.complete();
      const uncompletedTask = completedTask.uncomplete();

      expect(uncompletedTask.completed).toBe(false);
      expect(uncompletedTask.completedAt).toBeUndefined();
    });

    it('deve lançar erro se tentar descompletar tarefa não concluída', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');

      expect(() => {
        task.uncomplete();
      }).toThrow('Tarefa já está não concluída');
    });
  });

  describe('update', () => {
    it('deve atualizar os dados da tarefa', () => {
      const task = Task.create('123', 'user-123', 'Tarefa Antiga');
      const updatedTask = task.update('Tarefa Nova', 'Nova descrição');

      expect(updatedTask.title).toBe('Tarefa Nova');
      expect(updatedTask.description).toBe('Nova descrição');
      expect(updatedTask.id).toBe(task.id);
    });

    it('deve atualizar apenas o título', () => {
      const task = Task.create('123', 'user-123', 'Tarefa', 'Descrição');
      const updatedTask = task.update('Nova Tarefa');

      expect(updatedTask.title).toBe('Nova Tarefa');
      expect(updatedTask.description).toBe('Descrição');
    });

    it('deve atualizar apenas a prioridade', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      const updatedTask = task.update(
        undefined,
        undefined,
        undefined,
        TaskPriority.HIGH,
      );

      expect(updatedTask.priority).toBe(TaskPriority.HIGH);
      expect(updatedTask.title).toBe('Tarefa');
    });

    it('deve lançar erro se novo título for inválido', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');

      expect(() => {
        task.update('');
      }).toThrow('Título da tarefa não pode estar vazio');
    });
  });

  describe('isOverdue', () => {
    it('deve retornar true se tarefa estiver vencida', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, yesterday);

      expect(task.isOverdue()).toBe(true);
    });

    it('deve retornar false se tarefa não tiver data de vencimento', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      expect(task.isOverdue()).toBe(false);
    });

    it('deve retornar false se tarefa estiver concluída', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, yesterday);
      const completedTask = task.complete();

      expect(completedTask.isOverdue()).toBe(false);
    });

    it('deve retornar false se tarefa não estiver vencida', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, tomorrow);

      expect(task.isOverdue()).toBe(false);
    });
  });

  describe('isDueToday', () => {
    it('deve retornar true se tarefa vence hoje', () => {
      const today = new Date();
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, today);

      expect(task.isDueToday()).toBe(true);
    });

    it('deve retornar false se tarefa não vence hoje', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, tomorrow);

      expect(task.isDueToday()).toBe(false);
    });
  });

  describe('isDueSoon', () => {
    it('deve retornar true se tarefa vence em até 3 dias', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, tomorrow);

      expect(task.isDueSoon()).toBe(true);
    });

    it('deve retornar true se tarefa vence hoje', () => {
      const today = new Date();
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, today);

      expect(task.isDueSoon()).toBe(true);
    });

    it('deve retornar false se tarefa vence em mais de 3 dias', () => {
      const in5Days = new Date();
      in5Days.setDate(in5Days.getDate() + 5);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, in5Days);

      expect(task.isDueSoon()).toBe(false);
    });

    it('deve retornar false se tarefa estiver concluída', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, tomorrow);
      const completedTask = task.complete();

      expect(completedTask.isDueSoon()).toBe(false);
    });
  });

  describe('getDaysUntilDue', () => {
    it('deve retornar null se não tiver data de vencimento', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      expect(task.getDaysUntilDue()).toBeNull();
    });

    it('deve retornar 0 se vence hoje', () => {
      const today = new Date();
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, today);
      expect(task.getDaysUntilDue()).toBe(0);
    });

    it('deve retornar número positivo se vence no futuro', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, tomorrow);
      expect(task.getDaysUntilDue()).toBe(1);
    });

    it('deve retornar número negativo se estiver vencida', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = Task.create('123', 'user-123', 'Tarefa', undefined, yesterday);
      expect(task.getDaysUntilDue()).toBeLessThan(0);
    });
  });

  describe('isHighPriority', () => {
    it('deve retornar true se prioridade for alta', () => {
      const task = Task.create(
        '123',
        'user-123',
        'Tarefa',
        undefined,
        undefined,
        TaskPriority.HIGH,
      );
      expect(task.isHighPriority()).toBe(true);
    });

    it('deve retornar false se prioridade não for alta', () => {
      const task = Task.create(
        '123',
        'user-123',
        'Tarefa',
        undefined,
        undefined,
        TaskPriority.LOW,
      );
      expect(task.isHighPriority()).toBe(false);
    });
  });

  describe('canBeEdited e canBeDeleted', () => {
    it('deve permitir edição e deleção', () => {
      const task = Task.create('123', 'user-123', 'Tarefa');
      expect(task.canBeEdited()).toBe(true);
      expect(task.canBeDeleted()).toBe(true);
    });
  });
});

