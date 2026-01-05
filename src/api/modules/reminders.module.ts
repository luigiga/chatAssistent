/**
 * Módulo de Reminders
 */
import { Module } from '@nestjs/common';
import { RemindersController } from '../controllers/reminders.controller';
import { CreateReminderUseCase } from '@application/use-cases/reminders/create-reminder.use-case';
import { ListRemindersUseCase } from '@application/use-cases/reminders/list-reminders.use-case';
import { UpdateReminderUseCase } from '@application/use-cases/reminders/update-reminder.use-case';
import { DeleteReminderUseCase } from '@application/use-cases/reminders/delete-reminder.use-case';
import { CompleteReminderUseCase } from '@application/use-cases/reminders/complete-reminder.use-case';
import { PrismaReminderRepository } from '@infrastructure/repositories/prisma-reminder.repository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { REMINDER_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RemindersController],
  providers: [
    CreateReminderUseCase,
    ListRemindersUseCase,
    UpdateReminderUseCase,
    DeleteReminderUseCase,
    CompleteReminderUseCase,
    {
      provide: REMINDER_REPOSITORY,
      useClass: PrismaReminderRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    PrismaService,
  ],
  exports: [REMINDER_REPOSITORY, CreateReminderUseCase],
})
export class RemindersModule {}
