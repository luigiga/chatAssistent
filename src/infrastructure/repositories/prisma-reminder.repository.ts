/**
 * Implementação Prisma do repositório de Reminder
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReminderRepository } from '@domain/interfaces/repositories/reminder.repository.interface';
import { Reminder } from '@domain/entities/reminder.entity';

@Injectable()
export class PrismaReminderRepository implements ReminderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(reminder: Reminder): Promise<Reminder> {
    const created = await this.prisma.reminder.create({
      data: {
        id: reminder.id,
        userId: reminder.userId,
        title: reminder.title,
        description: reminder.description,
        reminderDate: reminder.reminderDate,
        isRecurring: reminder.isRecurring,
        recurrenceRule: reminder.recurrenceRule,
        completed: reminder.completed,
        completedAt: reminder.completedAt,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Reminder | null> {
    const found = await this.prisma.reminder.findUnique({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string): Promise<Reminder[]> {
    const reminders = await this.prisma.reminder.findMany({
      where: { userId },
      orderBy: { reminderDate: 'asc' },
    });

    return reminders.map((reminder) => this.mapToDomain(reminder));
  }

  async findByUserIdAndDate(
    userId: string,
    date: Date,
  ): Promise<Reminder[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reminders = await this.prisma.reminder.findMany({
      where: {
        userId,
        reminderDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { reminderDate: 'asc' },
    });

    return reminders.map((reminder) => this.mapToDomain(reminder));
  }

  async update(reminder: Reminder): Promise<Reminder> {
    const updated = await this.prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        title: reminder.title,
        description: reminder.description,
        reminderDate: reminder.reminderDate,
        isRecurring: reminder.isRecurring,
        recurrenceRule: reminder.recurrenceRule,
        completed: reminder.completed,
        completedAt: reminder.completedAt,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reminder.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaReminder: any): Reminder {
    return new Reminder(
      prismaReminder.id,
      prismaReminder.userId,
      prismaReminder.title,
      prismaReminder.reminderDate ? new Date(prismaReminder.reminderDate) : new Date(),
      prismaReminder.description,
      prismaReminder.isRecurring,
      prismaReminder.recurrenceRule,
      prismaReminder.completed,
      prismaReminder.createdAt ? new Date(prismaReminder.createdAt) : undefined,
      prismaReminder.updatedAt ? new Date(prismaReminder.updatedAt) : undefined,
      prismaReminder.completedAt ? new Date(prismaReminder.completedAt) : undefined,
    );
  }
}

