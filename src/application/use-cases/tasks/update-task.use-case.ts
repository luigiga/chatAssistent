/**
 * Use Case: Atualizar task
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { Task, TaskPriority } from '@domain/entities/task.entity';
import { UpdateTaskDto } from '../../dto/update-task.dto';
import { TASK_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(userId: string, taskId: string, dto: UpdateTaskDto): Promise<Task> {
    // Buscar task
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    // Verificar se pertence ao usuário
    if (task.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta task');
    }

    // Atualizar task
    const updatedTask = task.update(
      dto.title,
      dto.description ?? undefined,
      dto.dueDate,
      dto.priority as TaskPriority | undefined,
    );

    // Persistir
    return await this.taskRepository.update(updatedTask);
  }
}

