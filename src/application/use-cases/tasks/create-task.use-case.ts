/**
 * Use Case: Criar task
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { Task, TaskPriority } from '@domain/entities/task.entity';
import { CreateTaskDto } from '../../dto/create-task.dto';
import { randomUUID } from 'crypto';
import { TASK_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, dto: CreateTaskDto): Promise<Task> {
    // Verificar se usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Criar task
    const taskId = randomUUID();
    const task = Task.create(
      taskId,
      userId,
      dto.title,
      dto.description,
      dto.dueDate,
      dto.priority as TaskPriority | undefined,
    );

    // Persistir
    return await this.taskRepository.create(task);
  }
}

