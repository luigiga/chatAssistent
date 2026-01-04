/**
 * Implementação do repositório de interação com IA usando Prisma
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { AIInteraction } from '@domain/entities/ai-interaction.entity';

@Injectable()
export class PrismaAIInteractionRepository implements AIInteractionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(interaction: AIInteraction): Promise<AIInteraction> {
    const created = await this.prisma.aIInteraction.create({
      data: {
        id: interaction.id,
        userId: interaction.userId,
        userInput: interaction.userInput,
        aiResponse: interaction.aiResponse,
        needsConfirmation: interaction.needsConfirmation,
        confirmed: interaction.confirmed,
        createdAt: interaction.createdAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<AIInteraction | null> {
    const interaction = await this.prisma.aIInteraction.findUnique({
      where: { id },
    });

    return interaction ? this.toDomain(interaction) : null;
  }

  async findByUserId(
    userId: string,
    limit?: number,
  ): Promise<AIInteraction[]> {
    const interactions = await this.prisma.aIInteraction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return interactions.map((i) => this.toDomain(i));
  }

  async update(interaction: AIInteraction): Promise<AIInteraction> {
    const updated = await this.prisma.aIInteraction.update({
      where: { id: interaction.id },
      data: {
        userInput: interaction.userInput,
        aiResponse: interaction.aiResponse,
        needsConfirmation: interaction.needsConfirmation,
        confirmed: interaction.confirmed,
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(prismaInteraction: {
    id: string;
    userId: string;
    userInput: string;
    aiResponse: string;
    needsConfirmation: boolean;
    confirmed: boolean | null;
    createdAt: Date;
  }): AIInteraction {
    return new AIInteraction(
      prismaInteraction.id,
      prismaInteraction.userId,
      prismaInteraction.userInput,
      prismaInteraction.aiResponse,
      prismaInteraction.needsConfirmation,
      prismaInteraction.confirmed ?? undefined,
      prismaInteraction.createdAt,
    );
  }
}

