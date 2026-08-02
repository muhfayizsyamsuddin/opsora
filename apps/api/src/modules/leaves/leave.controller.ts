import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { LeaveService } from "./leave.service.js";
import { LeaveStatus } from "../../generated/prisma/enums.js";

export class LeaveController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const leave = await LeaveService.create(req.body);

    return created(
      res,
      leave,
      "Leave request created successfully",
    );
  });

    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const leaves = await LeaveService.getAll({
            page: req.query.page
            ? Number(req.query.page)
            : undefined,

            limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,

            search: req.query.search?.toString(),

            employeeId: req.query.employeeId?.toString(),

            status: req.query.status as LeaveStatus | undefined,

            sort: req.query.sort as
            | "startDate"
            | "endDate"
            | "createdAt"
            | undefined,

            order: req.query.order as
            | "asc"
            | "desc"
            | undefined,
        });

        return success(res, leaves);
    });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const leave = await LeaveService.getById(
      req.params.id.toString(),
    );

    return success(res, leave);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const leave = await LeaveService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      leave,
      "Leave updated successfully",
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await LeaveService.delete(
      req.params.id.toString(),
    );

    return noContent(res);
  });

    static approve = asyncHandler(async (req: Request, res: Response) => {
        const leave = await LeaveService.approve(
            req.params.id.toString(),
        );

        return success(
            res,
            leave,
            "Leave approved successfully",
        );
    });

    static reject = asyncHandler(async (req: Request, res: Response) => {
        const leave = await LeaveService.reject(
            req.params.id.toString(),
        );

        return success(
            res,
            leave,
            "Leave rejected successfully",
        );
    });
}