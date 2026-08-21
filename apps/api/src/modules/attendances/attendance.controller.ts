import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { AttendanceService } from "./attendance.service.js";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

export class AttendanceController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await AttendanceService.create(req.body);

    return created(
      res,
      attendance,
      "Attendance created successfully",
    );
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await AttendanceService.getById(
      req.params.id.toString(),
    );

    return success(res, attendance);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const attendance = await AttendanceService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      attendance,
      "Attendance updated successfully",
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await AttendanceService.delete(req.params.id.toString());

    return noContent(res);
  });

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const attendances =
        await AttendanceService.getAll({
          page: Number(req.query.page ?? 1),

          limit: Number(
            req.query.per_page ?? 20,
          ),

          date: req.query.date
            ? new Date(req.query.date.toString())
            : undefined,

          search:
            req.query.search?.toString(),

          employeeId:
            req.query.employee_id?.toString(),

          status:
            req.query.status as
              | AttendanceStatus
              | undefined,

          sort:
            req.query.sort_by as
              | "checkIn"
              | "createdAt"
              | undefined,

          order:
            req.query.sort_order as
              | "asc"
              | "desc"
              | undefined,
        });

      return success(res, attendances);
    },
  );

  static getEmployeeHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const attendances =
        await AttendanceService.getEmployeeHistory(
          req.params.employee_id.toString(),
          {
            page: Number(
              req.query.page ?? 1,
            ),

            limit: Number(
              req.query.per_page ?? 20,
            ),

            status:
              req.query.status as
                | AttendanceStatus
                | undefined,

            sort:
              req.query.sort_by as
                | "checkIn"
                | "createdAt"
                | undefined,

            order:
              req.query.sort_order as
                | "asc"
                | "desc"
                | undefined,
          },
        );

      return success(
        res,
        attendances,
      );
    },
  );
}