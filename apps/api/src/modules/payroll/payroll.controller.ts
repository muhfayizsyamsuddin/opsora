import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { PayrollService } from "./payroll.service.js";

export class PayrollController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payroll = await PayrollService.create(req.body);

    return created(
      res,
      payroll,
      "Payroll generated successfully",
    );
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const payrolls = await PayrollService.getAll();

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