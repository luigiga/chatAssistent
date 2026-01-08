/**
 * Módulo de interpretação
 */
import { Module } from '@nestjs/common';
import { InterpretController } from '../controllers/interpret.controller';
import { InterpretUseCase } from '@application/use-cases/interpret/interpret.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MockAIProvider } from '@infrastructure/ai/mock-ai-provider.service';
import { RealAIProvider } from '@infrastructure/ai/real-ai-provider.service';
import { FallbackAIProvider } from '@infrastructure/ai/fallback-ai-provider.service';
import { PrismaAIInteractionRepository } from '@infrastructure/repositories/prisma-ai-interaction.repository';
import { PrismaAIQuotaUsageRepository } from '@infrastructure/repositories/prisma-ai-quota-usage.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AIRateLimiter } from '@infrastructure/ai/ai-rate-limiter.service';
import { AICacheService } from '@infrastructure/ai/ai-cache.service';
import { CircuitBreakerService } from '@infrastructure/ai/circuit-breaker.service';
import { DateHeuristicService } from '@infrastructure/ai/date-heuristic.service';
import {
  AI_PROVIDER,
  AI_INTERACTION_REPOSITORY,
  AI_QUOTA_USAGE_REPOSITORY,
} from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';
import { TasksModule } from './tasks.module';
import { NotesModule } from './notes.module';
import { RemindersModule } from './reminders.module';

@Module({
  imports: [AuthModule, ConfigModule, TasksModule, NotesModule, RemindersModule],
  controllers: [InterpretController],
  providers: [
    InterpretUseCase,
    RealAIProvider,
    MockAIProvider,
    FallbackAIProvider,
    AIRateLimiter,
    AICacheService,
    CircuitBreakerService,
    DateHeuristicService,
    {
      provide: AI_PROVIDER,
      useFactory: (
        real: RealAIProvider,
        mock: MockAIProvider,
        fallback: FallbackAIProvider,
        config: ConfigService,
      ) => {
        const apiKey = config.get<string>('AI_API_KEY');
        // Se não tem chave, usar mock diretamente
        if (!apiKey) {
          return mock;
        }
        // Se tem chave, usar fallback (que tenta real e faz fallback para mock se necessário)
        return fallback;
      },
      inject: [RealAIProvider, MockAIProvider, FallbackAIProvider, ConfigService],
    },
    {
      provide: AI_INTERACTION_REPOSITORY,
      useClass: PrismaAIInteractionRepository,
    },
    {
      provide: AI_QUOTA_USAGE_REPOSITORY,
      useClass: PrismaAIQuotaUsageRepository,
    },
    PrismaService,
  ],
  exports: [AI_PROVIDER],
})
export class InterpretModule {}
