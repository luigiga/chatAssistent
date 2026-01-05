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
import { PrismaService } from '@infrastructure/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    AuthModule,
    InterpretModule,
    TasksModule,
    NotesModule,
    RemindersModule,
    InteractionsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

