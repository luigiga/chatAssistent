/**
 * Controller de Memórias
 * Endpoint unificado para buscar tasks, notes e reminders formatados como memórias
 */
import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListMemoriesUseCase } from '@application/use-cases/memories/list-memories.use-case';
import { SearchMemoriesUseCase } from '@application/use-cases/memories/search-memories.use-case';
import { ToggleFavoriteUseCase } from '@application/use-cases/memories/toggle-favorite.use-case';
import { TogglePinUseCase } from '@application/use-cases/memories/toggle-pin.use-case';
import { SetMemoryCategoryUseCase } from '@application/use-cases/memories/set-memory-category.use-case';
import { ListMemoriesDto, ListMemoriesDtoSchema } from '@application/dto/list-memories.dto';
import { SearchMemoriesDto, SearchMemoriesDtoSchema } from '@application/dto/search-memories.dto';
import { SetMemoryCategoryDto, SetMemoryCategoryDtoSchema } from '@application/dto/set-memory-category.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('memories')
@UseGuards(JwtAuthGuard)
export class MemoriesController {
  constructor(
    private readonly listMemoriesUseCase: ListMemoriesUseCase,
    private readonly searchMemoriesUseCase: SearchMemoriesUseCase,
    private readonly toggleFavoriteUseCase: ToggleFavoriteUseCase,
    private readonly togglePinUseCase: TogglePinUseCase,
    private readonly setMemoryCategoryUseCase: SetMemoryCategoryUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @CurrentUser() user: { sub: string },
    @Query() query: { space?: string },
  ) {
    // Validar e parsear query params
    const validatedDto = ListMemoriesDtoSchema.parse({
      space: query.space || 'all',
    });

    // Executar use case
    const memories = await this.listMemoriesUseCase.execute(user.sub, validatedDto);

    return memories;
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @CurrentUser() user: { sub: string },
    @Query() query: {
      q?: string;
      type?: string;
      from?: string;
      to?: string;
      category?: string;
    },
  ) {
    // Validar e parsear query params
    const validatedDto = SearchMemoriesDtoSchema.parse({
      q: query.q || '',
      type: (query.type as 'task' | 'note' | 'reminder' | 'all') || 'all',
      from: query.from,
      to: query.to,
      category: query.category,
    });

    // Executar use case
    const results = await this.searchMemoriesUseCase.execute(user.sub, validatedDto);

    return results;
  }

  @Patch(':id/favorite')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Query('type') type: string,
  ) {
    if (!type || !['task', 'note', 'reminder'].includes(type)) {
      throw new Error('Tipo de memória inválido. Use: task, note ou reminder');
    }

    const result = await this.toggleFavoriteUseCase.execute(
      user.sub,
      id,
      type as 'task' | 'note' | 'reminder',
    );

    return result;
  }

  @Patch(':id/pin')
  @HttpCode(HttpStatus.OK)
  async togglePin(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Query('type') type: string,
  ) {
    if (!type || !['task', 'note', 'reminder'].includes(type)) {
      throw new Error('Tipo de memória inválido. Use: task, note ou reminder');
    }

    const result = await this.togglePinUseCase.execute(
      user.sub,
      id,
      type as 'task' | 'note' | 'reminder',
    );

    return result;
  }

  @Patch(':id/category')
  @HttpCode(HttpStatus.OK)
  async setCategory(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Query('type') type: string,
    @Body(new ZodValidationPipe(SetMemoryCategoryDtoSchema)) dto: SetMemoryCategoryDto,
  ) {
    if (!type || !['task', 'note', 'reminder'].includes(type)) {
      throw new Error('Tipo de memória inválido. Use: task, note ou reminder');
    }

    await this.setMemoryCategoryUseCase.execute(
      user.sub,
      id,
      type as 'task' | 'note' | 'reminder',
      dto,
    );

    return { success: true };
  }
}

