/**
 * Módulo principal da aplicação
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { InterpretModule } from './modules/interpret.module';
import { TasksModule } from './modules/tasks.module';
import { NotesModule } from './modules/notes.module';
import { RemindersModule } from './modules/reminders.module';
import { InteractionsModule } from './modules/interactions.module';
import { HealthModule } from './modules/health.module';
import { MemoriesModule } from './modules/memories.module';
import { CategoriesModule } from './modules/categories.module';
import { SearchModule } from './modules/search.module';
import { NotificationsModule } from './modules/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    AuthModule,
    InterpretModule,
    TasksModule,
    NotesModule,
    RemindersModule,
    InteractionsModule,
    MemoriesModule,
    SearchModule,
    NotificationsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

