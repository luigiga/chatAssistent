/**
 * Módulo de Busca
 */
import { Module } from '@nestjs/common';
import { SearchController } from '../controllers/search.controller';
import { SearchMemoriesUseCase } from '@application/use-cases/memories/search-memories.use-case';
import { TasksModule } from './tasks.module';
import { NotesModule } from './notes.module';
import { RemindersModule } from './reminders.module';
import { CategoriesModule } from './categories.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, TasksModule, NotesModule, RemindersModule, CategoriesModule],
  controllers: [SearchController],
  providers: [SearchMemoriesUseCase],
  exports: [SearchMemoriesUseCase],
})
export class SearchModule {}

