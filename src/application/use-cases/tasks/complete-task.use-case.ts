/**
 * Use Case: Completar task
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { Task } from '@domain/entities/task.entity';
import { TASK_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class CompleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, taskId: string): Promise<Task> {
    // Buscar task
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    // Verificar se pertence ao usuário
    if (task.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para completar esta task');
    }

    // Completar task
    const completedTask = task.complete();

    // Persistir
    return await this.taskRepository.update(completedTask);
  }
}

