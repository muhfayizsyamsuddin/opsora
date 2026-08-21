import { prisma } from "../../lib/prisma.js";

export class RoleRepository {
  static async create(data: {
    name: string;
    description?: string;
    permissionIds: string[];
  }) {
    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          create: data.permissionIds.map((permissionId) => ({
            permission: {
              connect: {
                id: permissionId,
              },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  static async findByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    sortBy: "name" | "createdAt" = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    return prisma.role.findMany({
      skip,
      take,
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  static async count(search?: string) {
    return prisma.role.count({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    },
    permissionIds?: string[],
  ) {
    return prisma.$transaction(async (tx) => {
      if (permissionIds !== undefined) {
        await tx.rolePermission.deleteMany({
          where: { roleId: id },
        });
      }

      return tx.role.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          ...(permissionIds !== undefined && {
            permissions: {
              create: permissionIds.map((permissionId) => ({
                permission: {
                  connect: {
                    id: permissionId,
                  },
                },
              })),
            },
          }),
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  }

  static async delete(id: string) {
    return prisma.role.delete({
      where: { id },
    });
  }
}