/**
 * Módulo de interpretação
 */
import { Module } from '@nestjs/common';
import { InterpretController } from '../controllers/interpret.controller';
import { InterpretUseCase } from '@application/use-cases/interpret/interpret.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockAIProvider } from '@infrastructure/ai/mock-ai-provider.service';
import { RealAIProvider } from '@infrastructure/ai/real-ai-provider.service';
import { AIProvider } from '@domain/interfaces/ai-provider.interface';
import { PrismaAIInteractionRepository } from '@infrastructure/repositories/prisma-ai-interaction.repository';
import { AIInteractionRepository } from '@domain/interfaces/repositories/ai-interaction.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AI_PROVIDER, AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';


@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [InterpretController],
  providers: [
    InterpretUseCase,
    RealAIProvider,
    MockAIProvider,
    {
      provide: AI_PROVIDER,
      useFactory: (real: RealAIProvider, mock: MockAIProvider, config: ConfigService) => {
        const apiKey = config.get<string>('AI_API_KEY');
        return apiKey ? real : mock;
      },
      inject: [RealAIProvider, MockAIProvider, ConfigService],
    },
    {
      provide: AI_INTERACTION_REPOSITORY,
      useClass: PrismaAIInteractionRepository,
    },
    PrismaService,
  ],
  exports: [AI_PROVIDER],
})
export class InterpretModule {}

