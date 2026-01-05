/**
 * Use Case: Deletar note
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { NOTE_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class DeleteNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(userId: string, noteId: string): Promise<void> {
    // Buscar note
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new NotFoundException('Nota não encontrada');
    }

    // Verificar se pertence ao usuário
    if (note.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta nota');
    }

    // Deletar
    await this.noteRepository.delete(noteId);
  }
}

