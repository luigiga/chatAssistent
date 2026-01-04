/**
 * Implementação do repositório de refresh token usando Prisma
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RefreshTokenRepository } from '@domain/interfaces/repositories/refresh-token.repository.interface';
import { RefreshToken } from '@domain/entities/refresh-token.entity';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(token: RefreshToken): Promise<RefreshToken> {
    const created = await this.prisma.refreshToken.create({
      data: {
        id: token.id,
        token: token.token,
        userId: token.userId,
        expiresAt: token.expiresAt,
        createdAt: token.createdAt,
        revokedAt: token.revokedAt,
      },
    });

    return this.toDomain(created);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    return refreshToken ? this.toDomain(refreshToken) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    return tokens.map((t) => this.toDomain(t));
  }

  async revoke(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  private toDomain(prismaToken: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    revokedAt: Date | null;
  }): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.token,
      prismaToken.userId,
      prismaToken.expiresAt,
      prismaToken.createdAt,
      prismaToken.revokedAt ?? undefined,
    );
  }
}

