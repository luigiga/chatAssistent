/**
 * Implementação Prisma do repositório de Note
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NoteRepository } from '@domain/interfaces/repositories/note.repository.interface';
import { Note } from '@domain/entities/note.entity';

@Injectable()
export class PrismaNoteRepository implements NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(note: Note): Promise<Note> {
    const created = await this.prisma.note.create({
      data: {
        id: note.id,
        userId: note.userId,
        title: note.title,
        content: note.content,
        isFavorite: note.isFavorite,
        isPinned: note.isPinned,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Note | null> {
    const found = await this.prisma.note.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!found) {
      return null;
    }

    return this.mapToDomain(found);
  }

  async findByUserId(userId: string): Promise<Note[]> {
    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: { category: true },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return notes.map((note) => this.mapToDomain(note));
  }

  async update(note: Note): Promise<Note> {
    const updated = await this.prisma.note.update({
      where: { id: note.id },
      data: {
        title: note.title,
        content: note.content,
        isFavorite: note.isFavorite,
        isPinned: note.isPinned,
        categoryId: (note as any).categoryId,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.note.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaNote: any): Note {
    const note = Note.fromPersistence(
      prismaNote.id,
      prismaNote.userId,
      prismaNote.content,
      prismaNote.title,
      prismaNote.isFavorite || false,
      prismaNote.isPinned || false,
      prismaNote.createdAt ? new Date(prismaNote.createdAt) : undefined,
      prismaNote.updatedAt ? new Date(prismaNote.updatedAt) : undefined,
    );
    // Adicionar categoryId e category como propriedades extras
    (note as any).categoryId = prismaNote.categoryId;
    (note as any).category = prismaNote.category;
    return note;
  }
}

