/**
 * Implementação do repositório de usuário usando Prisma
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        updatedAt: user.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toDomain(prismaUser: {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.name ?? undefined,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}

