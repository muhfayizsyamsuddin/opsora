import { AppError } from "../../errors/AppError.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import { AttendanceRepository } from "./attendance.repository.js";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

export class AttendanceService {
  static async create(data: {
    employeeId: string;
    checkIn: Date;
    checkOut?: Date;
    status?: AttendanceStatus;
  }) {
    const employee = await EmployeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    if (
      data.checkOut &&
      data.checkOut.getTime() < data.checkIn.getTime()
    ) {
      throw new AppError(
        "Check out cannot be earlier than check in",
        400,
      );
    }

    return AttendanceRepository.create(data);
  }

  static async getById(id: string) {
    const attendance = await AttendanceRepository.findById(id);

    if (!attendance) {
      throw new AppError("Attendance not found", 404);
    }

    return attendance;
  }

  static async update(
    id: string,
    data: {
      checkOut?: Date;
      status?: AttendanceStatus;
    },
  ) {
    const attendance = await AttendanceRepository.findById(id);

    if (!attendance) {
      throw new AppError("Attendance not found", 404);
    }

    if (
      data.checkOut &&
      data.checkOut.getTime() < attendance.checkIn.getTime()
    ) {
      throw new AppError(
        "Check out cannot be earlier than check in",
        400,
      );
    }

    return AttendanceRepository.update(id, data);
  }

  static async delete(id: string) {
    const attendance = await AttendanceRepository.findById(id);

    if (!attendance) {
      throw new AppError("Attendance not found", 404);
    }

    await AttendanceRepository.delete(id);
  }

    static async getAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        employeeId?: string;
        status?: AttendanceStatus;
        sort?: "checkIn" | "createdAt";
        order?: "asc" | "desc";
    }) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const attendances = await AttendanceRepository.findMany(
            skip,
            limit,
            query.search,
            query.employeeId,
            query.status,
            query.sort,
            query.order,
        );

        const total = await AttendanceRepository.count(
            query.search,
            query.employeeId,
            query.status,
        );

        return {
            data: attendances,
            meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            },
        };
    }

  static async getEmployeeHistory(
    employeeId: string,
    query: {
      page?: number;
      limit?: number;
      status?: AttendanceStatus;
      sort?: "checkIn" | "createdAt";
      order?: "asc" | "desc";
    },
  ) {
    const employee =
      await EmployeeRepository.findById(employeeId);

    if (!employee) {
      throw new AppError(
        "Employee not found",
        404,
      );
    }

    return AttendanceService.getAll({
      page: query.page,
      limit: query.limit,
      employeeId,
      status: query.status,
      sort: query.sort,
      order: query.order,
    });
  }
}