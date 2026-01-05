/**
 * Use Case: Deletar task
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { TASK_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, taskId: string): Promise<void> {
    // Buscar task
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    // Verificar se pertence ao usuário
    if (task.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta task');
    }

    // Deletar
    await this.taskRepository.delete(taskId);
  }
}

