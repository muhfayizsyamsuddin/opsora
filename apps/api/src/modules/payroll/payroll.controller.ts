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

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      employeeId,
      month,
      year,
      search,
      sort,
      order,
    } = req.query;

    const payrolls = await PayrollService.getAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      employeeId: employeeId as string | undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      search: search as string | undefined,
      sort: (sort as keyof Prisma.PayrollOrderByWithRelationInput) ?? "createdAt",
      order: (order as Prisma.SortOrder) ?? "desc",
    });

    return success(res, payrolls);
  });

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