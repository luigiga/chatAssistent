/**
 * Use Case: Criar categoria
 */
import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { CATEGORY_REPOSITORY } from '@infrastructure/auth/tokens';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string, dto: CreateCategoryDto): Promise<Category> {
    const category = Category.create(
      randomUUID(),
      userId,
      dto.name,
      dto.color,
    );

    return await this.categoryRepository.create(category);
  }
}


