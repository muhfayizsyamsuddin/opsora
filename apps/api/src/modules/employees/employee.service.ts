import { AppError } from "../../errors/AppError.js";
import { EmployeeStatus } from "../../generated/prisma/browser.js";
import { prisma } from "../../lib/prisma.js";
import { DepartmentRepository } from "../departments/department.repository.js";
import { EmployeeRepository } from "./employee.repository.js";
import { Prisma } from "../../generated/prisma/client.js";

export class EmployeeService {
  static async create(data: {
    name: string;
    email: string;
    position: string;
    salary: number;
    hireDate: Date;
    departmentId: string;
  }) {
    const existingEmployee =
      await EmployeeRepository.findByEmail(data.email);

    if (existingEmployee) {
      throw new AppError(
        "Employee email already exists",
        409,
      );
    }

    const department =
      await DepartmentRepository.findById(
        data.departmentId,
      );

    if (!department) {
      throw new AppError(
        "Department not found",
        404,
      );
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const employeeCode =
        await EmployeeService.generateEmployeeCode();

      try {
        return await EmployeeRepository.create({
          ...data,
          employeeCode,
        });
      } catch (error) {
        const isEmployeeCodeConflict =
          error instanceof
            Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          String(
            error.meta?.target ?? "",
          ).includes("employeeCode");

        if (!isEmployeeCodeConflict) {
          throw error;
        }
      }
    }

    throw new AppError(
      "Unable to generate a unique employee code",
      409,
    );
  }

  static async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    status?: EmployeeStatus;
    sort?: "name" | "salary" | "hireDate" | "createdAt";
    order?: "asc" | "desc";
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const employees = await EmployeeRepository.findMany(
      skip,
      limit,
      query.search,
      query.departmentId,
      query.status,
      query.sort,
      query.order,
    );

    const total = await EmployeeRepository.count(
      query.search,
      query.departmentId,
      query.status,
    );

    return {
      data: employees,
      meta: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  static async getById(id: string) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    return employee;
  }

  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      position?: string;
      salary?: number;
      hireDate?: Date;
      departmentId?: string;
      status?: EmployeeStatus;
    },
  ) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    if (data.email && data.email !== employee.email) {
      const existingEmployee = await EmployeeRepository.findByEmail(data.email);

      if (existingEmployee) {
        throw new AppError("Employee email already exists", 409);
      }
    }

    if (data.departmentId) {
      const department = await DepartmentRepository.findById(
        data.departmentId,
      );

      if (!department) {
        throw new AppError("Department not found", 404);
      }
    }

    return EmployeeRepository.update(id, data);
  }

  static async delete(id: string) {
    const employee = await EmployeeRepository.findById(id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    await EmployeeRepository.deactivate(id);
  }

  static async generateEmployeeCode() {
    const lastEmployee =
      await prisma.employee.findFirst({
        orderBy: {
          employeeCode: "desc",
        },
        select: {
          employeeCode: true,
        },
      });

    const nextNumber = lastEmployee
      ? Number(
        lastEmployee.employeeCode.replace("EMP-", ""),
      ) + 1
      : 1;

    return `EMP-${String(nextNumber).padStart(4, "0")}`;
  }
}