import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { CustomerService } from "./customer.service.js";

export class CustomerController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const customer = await CustomerService.create(req.body);

      return created(
        res,
        customer,
        "Customer created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search?.toString();

      const sort = (
        req.query.sort?.toString() ?? "createdAt"
      ) as "name" | "createdAt";

      const order = (
        req.query.order?.toString() ?? "desc"
      ) as "asc" | "desc";

      const customers = await CustomerService.getAll(
        page,
        limit,
        search,
        sort,
        order,
      );

      return success(res, customers);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const customer = await CustomerService.getById(
        req.params.id.toString(),
      );

      return success(res, customer);
    },
  );

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const customer = await CustomerService.update(
        req.params.id.toString(),
        req.body,
      );

      return success(
        res,
        customer,
        "Customer updated successfully",
      );
    },
  );

  static delete = asyncHandler(
    async (req: Request, res: Response) => {
      await CustomerService.delete(
        req.params.id.toString(),
      );

      return noContent(res);
    },
  );
}