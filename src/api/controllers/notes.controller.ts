/**
 * Controller de Notes
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateNoteUseCase } from '@application/use-cases/notes/create-note.use-case';
import { ListNotesUseCase } from '@application/use-cases/notes/list-notes.use-case';
import { UpdateNoteUseCase } from '@application/use-cases/notes/update-note.use-case';
import { DeleteNoteUseCase } from '@application/use-cases/notes/delete-note.use-case';
import { CreateNoteDto, CreateNoteDtoSchema } from '@application/dto/create-note.dto';
import { UpdateNoteDto, UpdateNoteDtoSchema } from '@application/dto/update-note.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly listNotesUseCase: ListNotesUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateNoteDto,
  ) {
    const validatedDto = CreateNoteDtoSchema.parse(dto);
    const note = await this.createNoteUseCase.execute(user.sub, validatedDto);
    return this.mapToResponse(note);
  }

  @Get()
  async list(@CurrentUser() user: { sub: string }) {
    const notes = await this.listNotesUseCase.execute(user.sub);
    return notes.map((note) => this.mapToResponse(note));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    const notes = await this.listNotesUseCase.execute(user.sub);
    const note = notes.find((n) => n.id === id);
    if (!note) {
      return null;
    }
    return this.mapToResponse(note);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    const validatedDto = UpdateNoteDtoSchema.parse(dto);
    const note = await this.updateNoteUseCase.execute(user.sub, id, validatedDto);
    return this.mapToResponse(note);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
  ) {
    await this.deleteNoteUseCase.execute(user.sub, id);
  }

  private mapToResponse(note: any) {
    return {
      id: note.id,
      userId: note.userId,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt?.toISOString(),
      updatedAt: note.updatedAt?.toISOString(),
    };
  }
}

