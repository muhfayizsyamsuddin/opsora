import { prisma } from "../../lib/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const saleInclude = {
  customer: true,
  user: {
    select: userSelect,
  },
  items: {
    include: {
      product: true,
    },
  },
};

export class SaleRepository {
  static async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: saleInclude,
    });
  }

  static async findMany(
    skip: number,
    take: number,
    search?: string,
  ) {
    return prisma.sale.findMany({
      skip,
      take,
      where: search
        ? {
            customer: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : undefined,
      include: saleInclude,
      orderBy: {
        saleDate: "desc",
      },
    });
  }

  static async count(search?: string) {
    return prisma.sale.count({
      where: search
        ? {
            customer: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }
        : undefined,
    });
  }
}
