/**
 * Use Case: Atualizar note
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { Note } from '@domain/entities/note.entity';
import { UpdateNoteDto } from '../../dto/update-note.dto';
import { NOTE_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class UpdateNoteUseCase {
  constructor(
    @Inject(NOTE_REPOSITORY)
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(userId: string, noteId: string, dto: UpdateNoteDto): Promise<Note> {
    // Buscar note
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      throw new NotFoundException('Nota não encontrada');
    }

    // Verificar se pertence ao usuário
    if (note.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta nota');
    }

    // Atualizar note
    const updatedNote = note.update(dto.content, dto.title ?? undefined);

    // Persistir
    return await this.noteRepository.update(updatedNote);
  }
}

