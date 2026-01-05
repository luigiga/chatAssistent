/**
 * Implementação Prisma do repositório de AIQuotaUsage
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  AIQuotaUsageRepository,
  AIQuotaUsage,
} from '@domain/interfaces/repositories/ai-quota-usage.repository.interface';

@Injectable()
export class PrismaAIQuotaUsageRepository implements AIQuotaUsageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(userId: string, date: Date): Promise<AIQuotaUsage> {
    // Normalizar data para início do dia
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    const existing = await this.prisma.aIQuotaUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateStart,
        },
      },
    });

    if (existing) {
      return this.mapToDomain(existing);
    }

    const created = await this.prisma.aIQuotaUsage.create({
      data: {
        userId,
        date: dateStart,
        requestCount: 0,
      },
    });

    return this.mapToDomain(created);
  }

  async incrementRequestCount(userId: string, date: Date): Promise<AIQuotaUsage> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    // Usar upsert para criar se não existir
    const updated = await this.prisma.aIQuotaUsage.upsert({
      where: {
        userId_date: {
          userId,
          date: dateStart,
        },
      },
      create: {
        userId,
        date: dateStart,
        requestCount: 1,
      },
      update: {
        requestCount: {
          increment: 1,
        },
      },
    });

    return this.mapToDomain(updated);
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<AIQuotaUsage | null> {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    const found = await this.prisma.aIQuotaUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateStart,
        },
      },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string, limit: number = 30): Promise<AIQuotaUsage[]> {
    const quotas = await this.prisma.aIQuotaUsage.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });

    return quotas.map((quota) => this.mapToDomain(quota));
  }

  private mapToDomain(prismaQuota: any): AIQuotaUsage {
    return {
      id: prismaQuota.id,
      userId: prismaQuota.userId,
      date: new Date(prismaQuota.date),
      requestCount: prismaQuota.requestCount,
      createdAt: prismaQuota.createdAt ? new Date(prismaQuota.createdAt) : undefined,
      updatedAt: prismaQuota.updatedAt ? new Date(prismaQuota.updatedAt) : undefined,
    };
  }
}

