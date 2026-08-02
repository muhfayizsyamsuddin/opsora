import { prisma } from "../../lib/prisma.js";
import { UserRole } from "../../generated/prisma/enums.js";

export class UserRepository {
  static async create(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data,
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    role?: UserRole,
    sort: "name" | "email" | "role" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    return prisma.user.findMany({
      skip,
      take,
      where: {
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
        ...(role && {
          role,
        }),
      },
      orderBy: {
        [sort]: order,
      },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
    },
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  static async count(search?: string, role?: UserRole) {
    return prisma.user.count({
      where: {
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
        ...(role && {
          role,
        }),
      },
    });
  }
}