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

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const leaves = await LeaveService.getAll({
        page: Number(req.query.page ?? 1),

        limit: Number(
          req.query.per_page ?? 20,
        ),

        search:
          req.query.search?.toString(),

        employeeId:
          req.query.employee_id?.toString(),

        status:
          req.query.status as
            | LeaveStatus
            | undefined,

        startDate: req.query.start_date
          ? new Date(
              req.query.start_date.toString(),
            )
          : undefined,

        endDate: req.query.end_date
          ? new Date(
              req.query.end_date.toString(),
            )
          : undefined,

        sort:
          req.query.sort_by as
            | "startDate"
            | "endDate"
            | "createdAt"
            | undefined,

        order:
          req.query.sort_order as
            | "asc"
            | "desc"
            | undefined,
      });

      return success(res, leaves);
    },
  );

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

  static approve = asyncHandler(
    async (req: Request, res: Response) => {
      const leave =
        await LeaveService.approve(
          req.params.id.toString(),
          req.user!.id,
        );

      return success(
        res,
        leave,
        "Leave approved successfully",
      );
    },
  );

  static reject = asyncHandler(
    async (req: Request, res: Response) => {
      const leave =
        await LeaveService.reject(
          req.params.id.toString(),
          req.user!.id,
        );

      return success(
        res,
        leave,
        "Leave rejected successfully",
      );
    },
  );

  static cancel = asyncHandler(
    async (req: Request, res: Response) => {
      const leave = await LeaveService.cancel(
        req.params.id.toString(),
      );

      return success(
        res,
        leave,
        "Leave cancelled successfully",
      );
    },
  );
}