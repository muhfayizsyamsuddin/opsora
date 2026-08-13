import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { created, noContent, success } from '../../utils/response.js';
import { SupplierService } from './supplier.service.js';

export class SupplierController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const supplier = await SupplierService.create(req.body);

    return created(
      res,
      supplier,
      'Supplier created successfully',
    );
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search?.toString();

    const sort = (req.query.sort?.toString() ?? 'createdAt') as
      | 'name'
      | 'createdAt';

    const order = (req.query.order?.toString() ?? 'desc') as
      | 'asc'
      | 'desc';

    const suppliers = await SupplierService.getAllSuppliers(
      page,
      limit,
      search,
      sort,
      order,
    );

    return success(res, suppliers);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const supplier = await SupplierService.getById(
      req.params.id.toString(),
    );

    return success(res, supplier);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const supplier = await SupplierService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      supplier,
      'Supplier updated successfully',
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await SupplierService.delete(req.params.id.toString());

    return noContent(res);
  });
}