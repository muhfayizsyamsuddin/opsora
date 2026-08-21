import { AppError } from '../../errors/AppError.js';
import { CategoryRepository } from './category.repository.js';

export class CategoryService {
  static async create(data: {
    name: string;
    description?: string;
  }) {
    const existingCategory = await CategoryRepository.findByName(data.name);

    if (existingCategory) {
      throw new AppError('Category already exists', 409);
    }

    return CategoryRepository.create(data);
  }

  static async getAllCategories(
    page = 1,
    perPage = 20,
    search?: string,
    sort: "name" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const skip =
      (page - 1) * perPage;

    const [categories, total] =
      await Promise.all([
        CategoryRepository.findMany(
          skip,
          perPage,
          search,
          sort,
          order,
        ),
        CategoryRepository.count(
          search,
        ),
      ]);

    return {
      data: categories,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(
          total / perPage,
        ),
      },
    };
  }

  static async getById(id: string) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  static async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    },
  ) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.name) {
      const existingCategory =
        await CategoryRepository.findByName(data.name);

      if (
        existingCategory &&
        existingCategory.id !== id
      ) {
        throw new AppError('Category already exists', 409);
      }
    }

    return CategoryRepository.update(id, data);
  }

  static async delete(id: string) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await CategoryRepository.softDelete(id);
  }
}