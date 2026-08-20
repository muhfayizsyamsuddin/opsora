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

    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const attendances = await AttendanceService.getAll({
            page: req.query.page
            ? Number(req.query.page)
            : undefined,

            limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,

            search: req.query.search?.toString(),

            employeeId: req.query.employeeId?.toString(),

            status: req.query.status as AttendanceStatus | undefined,

            sort: req.query.sort as
            | "checkIn"
            | "createdAt"
            | undefined,

            order: req.query.order as
            | "asc"
            | "desc"
            | undefined,
        });

        return success(res, attendances);
    });

  static getEmployeeHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const attendances =
        await AttendanceService.getEmployeeHistory(
          req.params.employee_id.toString(),
          {
            page: req.query.page
              ? Number(req.query.page)
              : undefined,
            limit: req.query.limit
              ? Number(req.query.limit)
              : undefined,
            status: req.query.status as
              | AttendanceStatus
              | undefined,
            sort: req.query.sort as
              | "checkIn"
              | "createdAt"
              | undefined,
            order: req.query.order as
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