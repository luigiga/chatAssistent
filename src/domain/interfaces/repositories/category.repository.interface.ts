/**
 * Interface do repositório de Category
 */
import { Category } from '@domain/entities/category.entity';

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByUserId(userId: string): Promise<Category[]>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}


