import { AppError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { RoleRepository } from "./role.repository.js";

const SYSTEM_ROLES = new Set([
  "SUPER_ADMIN",
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CASHIER",
]);

function sanitizeRole(role: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: Array<{
    permission: {
      name: string;
    };
  }>;
}) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.map(
      (item) => item.permission.name,
    ),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

async function resolvePermissionIds(
  permissionNames: string[],
) {
  const uniqueNames = [
    ...new Set(
      permissionNames.map((name) => name.trim()),
    ),
  ];

  if (uniqueNames.length === 0) {
    return [];
  }

  const permissions = await prisma.permission.findMany({
    where: {
      name: {
        in: uniqueNames,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const foundNames = new Set(
    permissions.map((permission) => permission.name),
  );

  const missing = uniqueNames.filter(
    (name) => !foundNames.has(name),
  );

  if (missing.length > 0) {
    throw new AppError(
      `Unknown permissions: ${missing.join(", ")}`,
      400,
    );
  }

  return permissions.map(
    (permission) => permission.id,
  );
}

export class RoleService {
  static async create(data: {
    name: string;
    description?: string;
    permissions: string[];
  }) {
    const normalizedName =
      data.name.trim().toUpperCase();

    const existingRole =
      await RoleRepository.findByName(normalizedName);

    if (existingRole) {
      throw new AppError(
        "Role name already exists",
        409,
      );
    }

    const permissionIds =
      await resolvePermissionIds(data.permissions);

    const role = await RoleRepository.create({
      name: normalizedName,
      description: data.description,
      permissionIds,
    });

    return sanitizeRole(role);
  }

  static async getAll(
    page: number,
    perPage: number,
    search?: string,
    sortBy: "name" | "createdAt" = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    const skip =
      (page - 1) * perPage;

    const [roles, total] =
      await Promise.all([
        RoleRepository.findMany(
          skip,
          perPage,
          search,
          sortBy,
          sortOrder,
        ),

        RoleRepository.count(search),
      ]);

    return {
      data: roles.map(sanitizeRole),
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
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new AppError(
        "Role not found",
        404,
      );
    }

    return sanitizeRole(role);
  }

  static async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      permissions?: string[];
    },
  ) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new AppError(
        "Role not found",
        404,
      );
    }

    const isSystemRole =
      SYSTEM_ROLES.has(role.name);

    let normalizedName = data.name;

    if (data.name) {
      normalizedName =
        data.name.trim().toUpperCase();

      if (
        isSystemRole &&
        normalizedName !== role.name
      ) {
        throw new AppError(
          "System role name cannot be changed",
          400,
        );
      }

      const existingRole =
        await RoleRepository.findByName(
          normalizedName,
        );

      if (
        existingRole &&
        existingRole.id !== role.id
      ) {
        throw new AppError(
          "Role name already exists",
          409,
        );
      }
    }

    const permissionIds =
      data.permissions !== undefined
        ? await resolvePermissionIds(
            data.permissions,
          )
        : undefined;

    const updatedRole =
      await RoleRepository.update(
        id,
        {
          name: normalizedName,
          description: data.description,
        },
        permissionIds,
      );

    return sanitizeRole(updatedRole);
  }

  static async delete(id: string) {
    const role = await RoleRepository.findById(id);

    if (!role) {
      throw new AppError(
        "Role not found",
        404,
      );
    }

    if (SYSTEM_ROLES.has(role.name)) {
      throw new AppError(
        "System role cannot be deleted",
        400,
      );
    }

    const users = await prisma.user.count({
      where: {
        roleId: id,
      },
    });

    if (users > 0) {
      throw new AppError(
        "Role is assigned to users and cannot be deleted",
        400,
      );
    }

    await RoleRepository.delete(id);

    return {
      message: "Role deleted successfully",
    };
  }
}