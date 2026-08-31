import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError.js";
import { UserRepository } from "./user.repository.js";
import { prisma } from "../../lib/prisma.js";

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string | null;
  roleRef?: {
    name: string;
  } | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.roleRef?.name ?? null,
    roleId: user.roleId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserService {
  static async create(data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) {
    const existingUser = await UserRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const role = await prisma.role.findUnique({
      where: { id: data.roleId },
    });

    if (!role) {
      throw new AppError(
        "Role not found",
        404,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    return sanitizeUser(user);
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return sanitizeUser(user);
  }

  static async getAllUsers(
    page: number,
    limit: number,
    search?: string,
    roleId?: string,
    sort: "name" | "email" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserRepository.findMany(
        skip,
        limit,
        search,
        roleId,
        sort,
        order,
      ),
      UserRepository.count(search, roleId),
    ]);

    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleRef?.name ?? null,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return {
      data: safeUsers,
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
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return sanitizeUser(user);
  }

  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      roleId?: string;
    },
  ) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await UserRepository.findByEmail(data.email);

      if (existingUser) {
        throw new AppError("Email already exists", 409);
      }
    }

    if (data.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: data.roleId },
      });

      if (!role) {
        throw new AppError(
          "Role not found",
          404,
        );
      }
    }

    const updatedUser = await UserRepository.update(id, data);

    return sanitizeUser(updatedUser);
  }

  static async assignRole(
    id: string,
    roleId: string,
  ) {
    const user =
      await UserRepository.findById(id);

    if (!user) {
      throw new AppError(
        "User not found",
        404,
      );
    }

    const role =
      await prisma.role.findUnique({
        where: { id: roleId },
      });

    if (!role) {
      throw new AppError(
        "Role not found",
        404,
      );
    }

    const updatedUser =
      await UserRepository.update(id, {
        roleId,
      });

    return sanitizeUser(updatedUser);
  }

  static async getEffectivePermissions(id: string) {
    const user =
      await UserRepository.findByIdWithPermissions(id);

    if (!user) {
      throw new AppError(
        "User not found",
        404,
      );
    }

    return {
      userId: user.id,
      role: user.roleRef?.name ?? null,
      permissions:
        user.roleRef?.permissions.map(
          (item) => item.permission.name,
        ) ?? [],
    };
  }

  static async delete(
    id: string,
    actorId: string,
  ) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new AppError(
        "User not found",
        404,
      );
    }

    if (actorId === id) {
      throw new AppError(
        "User cannot deactivate themselves",
        400,
      );
    }

    const deactivatedUser =
      await UserRepository.deactivate(id);

    return sanitizeUser(deactivatedUser);
  }
}