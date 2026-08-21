import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { created, noContent, success } from '../../utils/response.js';
import { CategoryService } from './category.service.js';

export class CategoryController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.create(req.body);

    return created(
      res,
      category,
      'Category created successfully',
    );
  });

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(
        req.query.page ?? 1,
      );

      const perPage = Number(
        req.query.per_page ?? 20,
      );

      const search =
        req.query.search?.toString();

      const sortBy =
        (req.query.sort_by?.toString() ??
          "createdAt") as
          | "name"
          | "createdAt";

      const sortOrder =
        (req.query.sort_order?.toString() ??
          "desc") as
          | "asc"
          | "desc";

      const categories =
        await CategoryService.getAllCategories(
          page,
          perPage,
          search,
          sortBy,
          sortOrder,
        );

      return success(
        res,
        categories,
      );
    },
  );

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.getById(
      req.params.id.toString(),
    );

    return success(res, category);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      category,
      'Category updated successfully',
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await CategoryService.delete(req.params.id.toString());

    return noContent(res);
  });
}