/**
 * Implementação Prisma do repositório de Category
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        id: category.id,
        userId: category.userId,
        name: category.name,
        color: category.color,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Category | null> {
    const found = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return categories.map((category) => this.mapToDomain(category));
  }

  async update(category: Category): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        color: category.color,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaCategory: any): Category {
    return Category.fromPersistence(
      prismaCategory.id,
      prismaCategory.userId,
      prismaCategory.name,
      prismaCategory.color,
      prismaCategory.createdAt ? new Date(prismaCategory.createdAt) : undefined,
      prismaCategory.updatedAt ? new Date(prismaCategory.updatedAt) : undefined,
    );
  }
}


