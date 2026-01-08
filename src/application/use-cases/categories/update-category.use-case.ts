/**
 * Use Case: Atualizar categoria
 */
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CategoryRepository } from '@domain/interfaces/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { CATEGORY_REPOSITORY } from '@infrastructure/auth/tokens';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string, categoryId: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta categoria');
    }

    const updated = category.update(dto.name, dto.color);

    return await this.categoryRepository.update(updated);
  }
}


