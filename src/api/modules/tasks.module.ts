/**
 * Módulo de Tasks
 */
import { Module } from '@nestjs/common';
import { TasksController } from '../controllers/tasks.controller';
import { CreateTaskUseCase } from '@application/use-cases/tasks/create-task.use-case';
import { ListTasksUseCase } from '@application/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@application/use-cases/tasks/update-task.use-case';
import { DeleteTaskUseCase } from '@application/use-cases/tasks/delete-task.use-case';
import { CompleteTaskUseCase } from '@application/use-cases/tasks/complete-task.use-case';
import { PrismaTaskRepository } from '@infrastructure/repositories/prisma-task.repository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { TASK_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    ListTasksUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    CompleteTaskUseCase,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    PrismaService,
  ],
  exports: [TASK_REPOSITORY, CreateTaskUseCase],
})
export class TasksModule {}

