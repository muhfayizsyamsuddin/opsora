import { prisma } from "../../lib/prisma.js";

export class DepartmentRepository {
  static async create(data: { name: string }) {
    return prisma.department.create({
      data,
    });
  }

  static async findByName(name: string) {
    return prisma.department.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    sort: "name" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    return prisma.department.findMany({
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
          orderBy: {
            [sort]: order,
          },
    });
  }

  static async count(search?: string) {
    return prisma.department.count({
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

  static async findById(id: string) {
    return prisma.department.findUnique({
      where: {
        id,
      },
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
    },
  ) {
    return prisma.department.update({
      where: {
        id,
      },
        data,
    });
  }

  static async countEmployees(id: string) {
    return prisma.employee.count({
      where: {
        departmentId: id,
      },
    });
  }

  static async delete(id: string) {
    return prisma.department.delete({
      where: {
        id,
      },
    });
  }
}