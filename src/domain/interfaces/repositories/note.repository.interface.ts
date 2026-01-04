/**
 * Interface do Repositório de Nota
 * Define o contrato para persistência de notas
 */
import { Note } from '../../entities/note.entity';

export interface NoteRepository {
  /**
   * Cria uma nova nota
   */
  create(note: Note): Promise<Note>;

  /**
   * Busca uma nota por ID
   */
  findById(id: string): Promise<Note | null>;

  /**
   * Busca todas as notas de um usuário
   */
  findByUserId(userId: string): Promise<Note[]>;

  /**
   * Atualiza uma nota existente
   */
  update(note: Note): Promise<Note>;

  /**
   * Remove uma nota
   */
  delete(id: string): Promise<void>;
}

