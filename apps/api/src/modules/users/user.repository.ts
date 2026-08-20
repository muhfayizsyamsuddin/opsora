import { prisma } from "../../lib/prisma.js";

export class UserRepository {
  static async create(data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      },
      include: {
        roleRef: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roleRef: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roleRef: true,
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    roleId?: string,
    sort: "name" | "email" | "createdAt" = "createdAt",
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
        ...(roleId && {
          roleId,
        }),
      },
      include: {
        roleRef: true,
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
      roleId?: string;
    },
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
      },
      include: {
        roleRef: true,
      },
    });
  }

  static async count(
    search?: string,
    roleId?: string,
  ) {
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
        ...(roleId && {
          roleId,
        }),
      },
    });
  }

  static async findRoleByName(name: string) {
  return prisma.role.findUnique({
    where: {
      name,
    },
  });
}
}