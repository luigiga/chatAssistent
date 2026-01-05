/**
 * Módulo de Interações com IA
 */
import { Module } from '@nestjs/common';
import { InteractionsController } from '../controllers/interactions.controller';
import { ConfirmInteractionUseCase } from '@application/use-cases/interactions/confirm-interaction.use-case';
import { RejectInteractionUseCase } from '@application/use-cases/interactions/reject-interaction.use-case';
import { ListPendingInteractionsUseCase } from '@application/use-cases/interactions/list-pending-interactions.use-case';
import { PrismaAIInteractionRepository } from '@infrastructure/repositories/prisma-ai-interaction.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AI_INTERACTION_REPOSITORY } from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';
import { TasksModule } from './tasks.module';
import { NotesModule } from './notes.module';
import { RemindersModule } from './reminders.module';

@Module({
  imports: [AuthModule, TasksModule, NotesModule, RemindersModule],
  controllers: [InteractionsController],
  providers: [
    ConfirmInteractionUseCase,
    RejectInteractionUseCase,
    ListPendingInteractionsUseCase,
    {
      provide: AI_INTERACTION_REPOSITORY,
      useClass: PrismaAIInteractionRepository,
    },
    PrismaService,
  ],
})
export class InteractionsModule {}

