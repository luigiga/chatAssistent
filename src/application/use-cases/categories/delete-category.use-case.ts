/**
 * Use Case: Deletar categoria
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string, categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta categoria');
    }

    await this.categoryRepository.delete(categoryId);
  }
}


