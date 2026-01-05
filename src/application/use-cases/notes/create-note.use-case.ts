/**
 * Use Case: Criar note
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { UserRepository } from '@domain/interfaces/repositories/user.repository.interface';
import { Note } from '@domain/entities/note.entity';
import { CreateNoteDto } from '../../dto/create-note.dto';
import { randomUUID } from 'crypto';
import { NOTE_REPOSITORY, USER_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class CreateNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, dto: CreateNoteDto): Promise<Note> {
    // Verificar se usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Criar note
    const noteId = randomUUID();
    const note = Note.create(noteId, userId, dto.content, dto.title);

    // Persistir
    return await this.noteRepository.create(note);
  }
}

