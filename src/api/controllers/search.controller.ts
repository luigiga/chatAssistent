/**
 * Controller de Busca
 * Endpoint para busca global de memórias
 */
import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SearchMemoriesUseCase } from '@application/use-cases/memories/search-memories.use-case';
import { SearchMemoriesDto, SearchMemoriesDtoSchema } from '@application/dto/search-memories.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchMemoriesUseCase: SearchMemoriesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async search(
    @CurrentUser() user: { sub: string },
    @Query() query: {
      q?: string;
      types?: string | string[];
      categoryIds?: string | string[];
      from?: string;
      to?: string;
      status?: string;
    },
  ) {
    // Parsear types e categoryIds de query params (podem vir como CSV ou múltiplos params)
    const rawDto: any = {
      q: query.q || '',
      from: query.from,
      to: query.to,
      status: query.status as 'open' | 'done' | undefined,
    };

    // Parsear types
    if (query.types) {
      rawDto.types = Array.isArray(query.types)
        ? query.types
        : query.types.split(',').filter(Boolean);
    }

    // Parsear categoryIds
    if (query.categoryIds) {
      rawDto.categoryIds = Array.isArray(query.categoryIds)
        ? query.categoryIds
        : query.categoryIds.split(',').filter(Boolean);
    }

    // Validar com Zod
    const validatedDto = SearchMemoriesDtoSchema.parse(rawDto);

    // Executar use case
    const results = await this.searchMemoriesUseCase.execute(user.sub, validatedDto);

    return results;
  }
}

