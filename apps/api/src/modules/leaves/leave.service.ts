import { AppError } from "../../errors/AppError.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import { LeaveRepository } from "./leave.repository.js";
import { LeaveStatus } from "../../generated/prisma/enums.js";

export class LeaveService {
  static async create(data: {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status?: LeaveStatus;
  }) {
    const employee = await EmployeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    if (data.startDate > data.endDate) {
      throw new AppError(
        "Start date cannot be after end date",
        400,
      );
    }

    const overlappingLeave =
    await LeaveRepository.findOverlappingLeave(
        data.employeeId,
        data.startDate,
        data.endDate,
    );

    if (overlappingLeave) {
    throw new AppError(
        "Leave request overlaps with an existing leave",
        409,
    );
    }

    return LeaveRepository.create({
      ...data,
      status: LeaveStatus.PENDING,
    });
  }

    static async getAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: LeaveStatus;
        employeeId?: string;
        sort?: "startDate" | "endDate" | "createdAt";
        order?: "asc" | "desc";
    }) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const skip = (page - 1) * limit;

        const leaves = await LeaveRepository.findMany(
            skip,
            limit,
            query.search,
            query.status,
            query.employeeId,
            query.sort,
            query.order,
        );

        const total = await LeaveRepository.count(
            query.search,
            query.status,
            query.employeeId,
        );

        return {
            data: leaves,
            meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            },
        };
    }

  static async getById(id: string) {
    const leave = await LeaveRepository.findById(id);

    if (!leave) {
      throw new AppError("Leave not found", 404);
    }

    return leave;
  }

  static async update(
    id: string,
    data: {
      startDate?: Date;
      endDate?: Date;
      reason?: string;
      status?: LeaveStatus;
    },
  ) {
    const leave = await LeaveRepository.findById(id);

    if (!leave) {
      throw new AppError("Leave not found", 404);
    }

    const startDate =
      data.startDate ?? leave.startDate;

    const endDate =
      data.endDate ?? leave.endDate;

    if (startDate > endDate) {
      throw new AppError(
        "Start date cannot be after end date",
        400,
      );
    }

    const overlappingLeave =
      await LeaveRepository.findOverlappingLeaveForUpdate(
        id,
        leave.employeeId,
        startDate,
        endDate,
      );

    if (overlappingLeave) {
      throw new AppError(
        "Leave request overlaps with an existing leave",
        409,
      );
    }

    return LeaveRepository.update(id, {
      ...data,
      startDate,
      endDate,
    });
  }

  static async delete(id: string) {
    const leave = await LeaveRepository.findById(id);

    if (!leave) {
      throw new AppError("Leave not found", 404);
    }

    await LeaveRepository.delete(id);
  }

    static async approve(id: string) {
        const leave = await LeaveRepository.findById(id);

        if (!leave) {
            throw new AppError("Leave not found", 404);
        }

        if (leave.status !== LeaveStatus.PENDING) {
            throw new AppError(
            "Only pending leave can be approved",
            400,
            );
        }

        return LeaveRepository.approve(id);
    }

    static async reject(id: string) {
        const leave = await LeaveRepository.findById(id);

        if (!leave) {
            throw new AppError("Leave not found", 404);
        }

        if (leave.status !== LeaveStatus.PENDING) {
            throw new AppError(
            "Only pending leave can be rejected",
            400,
            );
        }

        return LeaveRepository.reject(id);
    }
}