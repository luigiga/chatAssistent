/**
 * Controller de Categorias
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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateCategoryUseCase } from '@application/use-cases/categories/create-category.use-case';
import { ListCategoriesUseCase } from '@application/use-cases/categories/list-categories.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/categories/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/categories/delete-category.use-case';
import { CreateCategoryDto, CreateCategoryDtoSchema } from '@application/dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryDtoSchema } from '@application/dto/update-category.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@CurrentUser() user: { sub: string }) {
    return this.listCategoriesUseCase.execute(user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { sub: string },
    @Body(new ZodValidationPipe(CreateCategoryDtoSchema)) dto: CreateCategoryDto,
  ) {
    return this.createCategoryUseCase.execute(user.sub, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategoryDtoSchema)) dto: UpdateCategoryDto,
  ) {
    return this.updateCategoryUseCase.execute(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    await this.deleteCategoryUseCase.execute(user.sub, id);
  }
}


