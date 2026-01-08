/**
 * Módulo de Categorias
 */
import { Module } from '@nestjs/common';
import { CategoriesController } from '../controllers/categories.controller';
import { CreateCategoryUseCase } from '@application/use-cases/categories/create-category.use-case';
import { ListCategoriesUseCase } from '@application/use-cases/categories/list-categories.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/categories/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/categories/delete-category.use-case';
import { PrismaCategoryRepository } from '@infrastructure/repositories/prisma-category.repository';
import { CATEGORY_REPOSITORY } from '@infrastructure/auth/tokens';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
    PrismaService,
  ],
  exports: [CATEGORY_REPOSITORY, ListCategoriesUseCase],
})
export class CategoriesModule {}


