/**
 * Interface do Repositório de Tarefa
 * Define o contrato para persistência de tarefas
 */
import { Task } from '../../entities/task.entity';

export interface TaskRepository {
  /**
   * Cria uma nova tarefa
   */
  create(task: Task): Promise<Task>;

  /**
   * Busca uma tarefa por ID
   */
  findById(id: string): Promise<Task | null>;

  /**
   * Busca todas as tarefas de um usuário
   */
  findByUserId(userId: string): Promise<Task[]>;

  /**
   * Busca tarefas de um usuário com filtros
   */
  findByUserIdAndFilters(
    userId: string,
    filters: {
      completed?: boolean;
      priority?: string;
    },
  ): Promise<Task[]>;

  /**
   * Atualiza uma tarefa existente
   */
  update(task: Task): Promise<Task>;

  /**
   * Remove uma tarefa
   */
  delete(id: string): Promise<void>;

  /**
   * Busca tarefas vencidas
   */
  findOverdueTasks(now: Date): Promise<Task[]>;
}

