/**
 * Use Case: Listar tasks do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { Task } from '@domain/entities/task.entity';
import { ListTasksQueryDto } from '../../dto/list-tasks-query.dto';
import { TASK_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, query: ListTasksQueryDto): Promise<Task[]> {
    // Se houver filtros, usar método com filtros
    if (query.completed !== undefined || query.priority) {
      return await this.taskRepository.findByUserIdAndFilters(userId, {
        completed: query.completed,
        priority: query.priority,
      });
    }

    // Caso contrário, buscar todas
    return await this.taskRepository.findByUserId(userId);
  }
}

