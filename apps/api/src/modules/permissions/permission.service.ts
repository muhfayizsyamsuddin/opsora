import { AppError } from "../../errors/AppError.js";
import { PermissionRepository } from "./permission.repository.js";

export class PermissionService {
  static async getAll(
    page: number,
    perPage: number,
    search?: string,
    sortBy: "name" | "createdAt" = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    const skip =
      (page - 1) * perPage;

    const [permissions, total] =
      await Promise.all([
        PermissionRepository.findMany(
          skip,
          perPage,
          search,
          sortBy,
          sortOrder,
        ),

        PermissionRepository.count(
          search,
        ),
      ]);

    return {
      data: permissions,
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