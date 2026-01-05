/**
 * Use Case: Listar notes do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { Note } from '@domain/entities/note.entity';
import { NOTE_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class ListNotesUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(userId: string): Promise<Note[]> {
    return await this.noteRepository.findByUserId(userId);
  }
}

