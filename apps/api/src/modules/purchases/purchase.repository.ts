import { prisma } from "../../lib/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class PurchaseRepository {
  static async findById(id: string) {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        user: {
          select: userSelect,
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
  ) {
    return prisma.purchase.findMany({
      skip,
      take,
      where: search
        ? {
            supplier: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : undefined,
      include: {
        supplier: true,
        user: {
          select: userSelect,
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });
  }

  static async count(search?: string) {
    return prisma.purchase.count({
      where: search
        ? {
            supplier: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    });
  }

  static async create(data: {
    supplierId: string;
    userId: string;
    purchaseDate: Date;
    totalAmount: number;
    status: "DRAFT" | "COMPLETED" | "CANCELLED";
  }) {
    return prisma.purchase.create({
      data,
    });
  }
}