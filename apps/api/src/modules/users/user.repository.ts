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

  static async findMany() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
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
}