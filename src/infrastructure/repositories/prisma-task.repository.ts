/**
 * Implementação Prisma do repositório de Task
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaskRepository } from '@domain/interfaces/repositories/task.repository.interface';
import { Task, TaskPriority } from '@domain/entities/task.entity';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    const created = await this.prisma.task.create({
      data: {
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        priority: task.priority,
        completedAt: task.completedAt,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => this.mapToDomain(task));
  }

  async findByUserIdAndFilters(
    userId: string,
    filters: {
      completed?: boolean;
      priority?: string;
    },
  ): Promise<Task[]> {
    const where: any = { userId };

    if (filters.completed !== undefined) {
      where.completed = filters.completed;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((task) => this.mapToDomain(task));
  }

  async update(task: Task): Promise<Task> {
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        priority: task.priority,
        completedAt: task.completedAt,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaTask: any): Task {
    return Task.fromPersistence(
      prismaTask.id,
      prismaTask.userId,
      prismaTask.title,
      prismaTask.description,
      prismaTask.completed,
      prismaTask.dueDate ? new Date(prismaTask.dueDate) : undefined,
      prismaTask.priority as TaskPriority | undefined,
      prismaTask.createdAt ? new Date(prismaTask.createdAt) : undefined,
      prismaTask.updatedAt ? new Date(prismaTask.updatedAt) : undefined,
      prismaTask.completedAt ? new Date(prismaTask.completedAt) : undefined,
    );
  }
}

