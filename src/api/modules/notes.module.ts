/**
 * Módulo de Notes
 */
import { Module } from '@nestjs/common';
import { NotesController } from '../controllers/notes.controller';
import { CreateNoteUseCase } from '@application/use-cases/notes/create-note.use-case';
import { ListNotesUseCase } from '@application/use-cases/notes/list-notes.use-case';
import { UpdateNoteUseCase } from '@application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from '@application/use-cases/notes/delete-note.use-case';
import { PrismaNoteRepository } from '@infrastructure/repositories/prisma-note.repository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { NOTE_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [NotesController],
  providers: [
    CreateNoteUseCase,
    ListNotesUseCase,
    UpdateNoteUseCase,
    DeleteNoteUseCase,
    {
      provide: NOTE_REPOSITORY,
      useClass: PrismaNoteRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    PrismaService,
  ],
  exports: [NOTE_REPOSITORY, CreateNoteUseCase, ListNotesUseCase],
})
export class NotesModule {}

