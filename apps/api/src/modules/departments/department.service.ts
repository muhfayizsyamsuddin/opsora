import { AppError } from "../../errors/AppError.js";
import { DepartmentRepository } from "./department.repository.js";

export class DepartmentService {
  static async create(data: { name: string }) {
    const existingDepartment =
      await DepartmentRepository.findByName(data.name);

    if (existingDepartment) {
      throw new AppError("Department already exists", 409);
    }

    return DepartmentRepository.create(data);
  }

  static async getAllDepartments(
    page = 1,
    perPage = 20,
    search?: string,
    sort: "name" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const skip =
      (page - 1) * perPage;

    const [departments, total] =
      await Promise.all([
        DepartmentRepository.findMany(
          skip,
          perPage,
          search,
          sort,
          order,
        ),
        DepartmentRepository.count(
          search,
        ),
      ]);

    return {
      data: departments,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(
          total / perPage,
        ),
      },
    };
  }

  static async getById(id: string) {
    const department = await DepartmentRepository.findById(id);

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    return department;
  }

    static async update(
        id: string,
        data: {
            name?: string;
        },
        ) {
        const department = await DepartmentRepository.findById(id);

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        if (data.name) {
            const existingDepartment =
            await DepartmentRepository.findByName(data.name);

            if (
            existingDepartment &&
            existingDepartment.id !== id
            ) {
            throw new AppError("Department already exists", 409);
            }
        }

        return DepartmentRepository.update(id, data);
    }

    static async delete(id: string) {
      const department =
        await DepartmentRepository.findById(id);

      if (!department) {
        throw new AppError(
          "Department not found",
          404,
        );
      }

      const employeeCount =
        await DepartmentRepository.countEmployees(
          id,
        );

      if (employeeCount > 0) {
        throw new AppError(
          "Department cannot be deleted while it still has employees",
          409,
        );
      }

      await DepartmentRepository.delete(id);
    }
}