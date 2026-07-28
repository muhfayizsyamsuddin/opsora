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
}