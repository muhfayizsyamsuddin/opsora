import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { created, noContent, success } from '../../utils/response.js';
import { ProductService } from './product.service.js';
import { AppError } from '../../errors/AppError.js';

export class ProductController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.create(req.body);

    return created(
      res,
      product,
      'Product created successfully',
    );
  });

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);

      const perPage = Number(
        req.query.per_page ?? 20,
      );

      const search =
        req.query.search?.toString();

      const categoryId =
        req.query.category_id?.toString();

      const status =
        req.query.status?.toString() as
          | "ACTIVE"
          | "INACTIVE"
          | undefined;

      const sortBy =
        (req.query.sort_by?.toString() ??
          "createdAt") as
          | "name"
          | "sku"
          | "createdAt";

      const sortOrder =
        (req.query.sort_order?.toString() ??
          "desc") as
          | "asc"
          | "desc";

      const products =
        await ProductService.getAllProducts(
          page,
          perPage,
          search,
          categoryId,
          status,
          sortBy,
          sortOrder,
        );

      return success(res, products);
    },
  );

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getById(
      req.params.id.toString(),
    );

    return success(res, product);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      product,
      'Product updated successfully',
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await ProductService.delete(
      req.params.id.toString(),
    );

    return noContent(res);
  });

  static uploadImage = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.file) {
        throw new AppError('Image file is required', 400);
        }

        const product = await ProductService.uploadImage(
        req.params.id.toString(),
        req.file,
        );

        return success(
        res,
        product,
        'Product image uploaded successfully',
        );
    },
  );
}