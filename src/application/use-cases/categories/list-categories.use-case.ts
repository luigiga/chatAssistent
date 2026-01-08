/**
 * Use Case: Listar categorias do usuário
 */
import { Injectable, Inject } from '@nestjs/common';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';
import { CATEGORY_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string): Promise<Category[]> {
    return await this.categoryRepository.findByUserId(userId);
  }
}


