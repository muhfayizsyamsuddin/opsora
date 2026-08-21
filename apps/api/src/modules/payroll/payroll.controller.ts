import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { PayrollService } from "./payroll.service.js";
import { Prisma } from "../../generated/prisma/client.js";

export class PayrollController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payroll = await PayrollService.create(req.body);

    return created(
      res,
      payroll,
      "Payroll generated successfully",
    );
  });

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const payrolls =
        await PayrollService.getAll({
          page: Number(
            req.query.page ?? 1,
          ),

          perPage: Number(
            req.query.per_page ?? 20,
          ),

          employeeId:
            req.query.employee_id?.toString(),

          month: req.query.month
            ? Number(req.query.month)
            : undefined,

          year: req.query.year
            ? Number(req.query.year)
            : undefined,

          search:
            req.query.search?.toString(),

          sort:
            (req.query.sort_by as
              | keyof Prisma.PayrollOrderByWithRelationInput
              | undefined) ??
            "createdAt",

          order:
            (req.query.sort_order as
              | Prisma.SortOrder
              | undefined) ??
            "desc",
        });

      return success(
        res,
        payrolls,
      );
    },
  );

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const payroll = await PayrollService.getById(
      req.params.id.toString(),
    );

    return success(res, payroll);
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await PayrollService.delete(req.params.id.toString());

    return noContent(res);
  });
}