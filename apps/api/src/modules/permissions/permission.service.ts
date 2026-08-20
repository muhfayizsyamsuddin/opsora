import { AppError } from "../../errors/AppError.js";
import { PermissionRepository } from "./permission.repository.js";

export class PermissionService {
  static async getAll(
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const [permissions, total] = await Promise.all([
      PermissionRepository.findMany(
        skip,
        limit,
        search,
      ),
      PermissionRepository.count(search),
    ]);

    return {
      data: permissions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const permission =
      await PermissionRepository.findById(id);

    if (!permission) {
      throw new AppError(
        "Permission not found",
        404,
      );
    }

    return permission;
  }
}