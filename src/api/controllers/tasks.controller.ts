/**
 * Controller de Tasks
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTaskUseCase } from '@application/use-cases/tasks/create-task.use-case';
import { ListTasksUseCase } from '@application/use-cases/tasks/list-tasks.use-case';
import { UpdateTaskUseCase } from '@application/use-cases/tasks/update-task.use-case';
import { DeleteTaskUseCase } from '@application/use-cases/tasks/delete-task.use-case';
import { CompleteTaskUseCase } from '@application/use-cases/tasks/complete-task.use-case';
import { CreateTaskDto, CreateTaskDtoSchema } from '@application/dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskDtoSchema } from '@application/dto/update-task.dto';
import { ListTasksQueryDto, ListTasksQueryDtoSchema } from '@application/dto/list-tasks-query.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly completeTaskUseCase: CompleteTaskUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateTaskDto,
  ) {
    const validatedDto = CreateTaskDtoSchema.parse(dto);
    const task = await this.createTaskUseCase.execute(user.sub, validatedDto);
    return this.mapToResponse(task);
  }

  @Get()
  async list(
    @CurrentUser() user: { sub: string },
    @Query() query: any,
  ) {
    const validatedQuery = ListTasksQueryDtoSchema.parse(query);
    const tasks = await this.listTasksUseCase.execute(user.sub, validatedQuery);
    return tasks.map((task) => this.mapToResponse(task));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    // Por enquanto, usar list e filtrar
    // Futuramente criar FindTaskByIdUseCase
    const tasks = await this.listTasksUseCase.execute(user.sub, { page: 1, limit: 1000 });
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return null;
    }
    return this.mapToResponse(task);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const validatedDto = UpdateTaskDtoSchema.parse(dto);
    const task = await this.updateTaskUseCase.execute(user.sub, id, validatedDto);
    return this.mapToResponse(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    await this.deleteTaskUseCase.execute(user.sub, id);
  }

  @Patch(':id/complete')
  async complete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    const task = await this.completeTaskUseCase.execute(user.sub, id);
    return this.mapToResponse(task);
  }

  private mapToResponse(task: any) {
    return {
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate?.toISOString(),
      priority: task.priority,
      createdAt: task.createdAt?.toISOString(),
      updatedAt: task.updatedAt?.toISOString(),
      completedAt: task.completedAt?.toISOString(),
    };
  }
}

