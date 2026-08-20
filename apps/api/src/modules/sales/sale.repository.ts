import { prisma } from "../../lib/prisma.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  isActive: true,
  roleRef: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
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
    customerId?: string,
    dateFrom?: Date,
    dateTo?: Date,
    sortBy:
      | "saleDate"
      | "createdAt"
      | "totalAmount" = "saleDate",
    sortOrder: "asc" | "desc" = "desc",
  ) {
    const where = {
      ...(customerId && {
        customerId,
      }),

      ...(search && {
        customer: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      }),

      ...(dateFrom || dateTo
        ? {
            saleDate: {
              ...(dateFrom && {
                gte: dateFrom,
              }),
              ...(dateTo && {
                lte: dateTo,
              }),
            },
          }
        : {}),
    };

    return prisma.sale.findMany({
      skip,
      take,
      where,
      include: saleInclude,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  static async count(
    search?: string,
    customerId?: string,
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const where = {
      ...(customerId && {
        customerId,
      }),

      ...(search && {
        customer: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      }),

      ...(dateFrom || dateTo
        ? {
            saleDate: {
              ...(dateFrom && {
                gte: dateFrom,
              }),
              ...(dateTo && {
                lte: dateTo,
              }),
            },
          }
        : {}),
    };

    return prisma.sale.count({
      where,
    });
  }
}