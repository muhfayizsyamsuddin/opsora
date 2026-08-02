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
    limit = 10,
    search?: string,
    sort: "name" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      DepartmentRepository.findMany(
        skip,
        limit,
        search,
        sort,
        order,
      ),
      DepartmentRepository.count(search),
    ]);

    return {
      data: departments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
        const department = await DepartmentRepository.findById(id);

        if (!department) {
            throw new AppError("Department not found", 404);
        }

        await DepartmentRepository.delete(id);
    }
}