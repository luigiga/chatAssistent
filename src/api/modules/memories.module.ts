/**
 * Módulo de Memórias
 */
import { Module } from '@nestjs/common';
import { MemoriesController } from '../controllers/memories.controller';
import { ListMemoriesUseCase } from '@application/use-cases/memories/list-memories.use-case';
import { SearchMemoriesUseCase } from '@application/use-cases/memories/search-memories.use-case';
import { ToggleFavoriteUseCase } from '@application/use-cases/memories/toggle-favorite.use-case';
import { TogglePinUseCase } from '@application/use-cases/memories/toggle-pin.use-case';
import { SetMemoryCategoryUseCase } from '@application/use-cases/memories/set-memory-category.use-case';
import { TasksModule } from './tasks.module';
import { NotesModule } from './notes.module';
import { RemindersModule } from './reminders.module';
import { CategoriesModule } from './categories.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, TasksModule, NotesModule, RemindersModule, CategoriesModule],
  controllers: [MemoriesController],
  providers: [ListMemoriesUseCase, SearchMemoriesUseCase, ToggleFavoriteUseCase, TogglePinUseCase, SetMemoryCategoryUseCase],
  exports: [ListMemoriesUseCase, SearchMemoriesUseCase, ToggleFavoriteUseCase, TogglePinUseCase, SetMemoryCategoryUseCase],
})
export class MemoriesModule {}

