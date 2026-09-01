import { Prisma } from "../../generated/prisma/client.js";
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

type FindManyParams = {
  skip: number;
  take: number;
  search?: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  saleId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "returnDate" | "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
};

export class SaleReturnRepository {
  static async findById(id: string) {
    return prisma.saleReturn.findUnique({
      where: { id },
      include: {
        sale: {
          include: {
            customer: true,
          },
        },
        user: {
          select: userSelect,
        },
        items: {
          include: {
            saleItem: true,
            product: true,
          },
        },
      },
    });
  }

  static async findMany({
    skip,
    take,
    search,
    status,
    saleId,
    dateFrom,
    dateTo,
    sortBy = "returnDate",
    sortOrder = "desc",
  }: FindManyParams) {
    return prisma.saleReturn.findMany({
      skip,
      take,
      where: {
        ...(status && {
          status,
        }),

        ...(saleId && {
          saleId,
        }),

        ...(search && {
          sale: {
            customer: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        }),

        ...((dateFrom || dateTo) && {
          returnDate: {
            ...(dateFrom && {
              gte: dateFrom,
            }),
            ...(dateTo && {
              lte: dateTo,
            }),
          },
        }),
      },

      include: {
        sale: {
          include: {
            customer: true,
          },
        },

        user: {
          select: userSelect,
        },

        items: {
          include: {
            saleItem: true,
            product: true,
          },
        },
      },

      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  static async count({
    search,
    status,
    saleId,
    dateFrom,
    dateTo,
  }: Omit<
    FindManyParams,
    "skip" | "take" | "sortBy" | "sortOrder"
  >) {
    return prisma.saleReturn.count({
      where: {
        ...(status && {
          status,
        }),

        ...(saleId && {
          saleId,
        }),

        ...(search && {
          sale: {
            customer: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        }),

        ...((dateFrom || dateTo) && {
          returnDate: {
            ...(dateFrom && {
              gte: dateFrom,
            }),
            ...(dateTo && {
              lte: dateTo,
            }),
          },
        }),
      },
    });
  }

  static async create(data: {
    saleId: string;
    userId: string;
    returnDate: Date;
    reason?: string;
    totalAmount: number;

    items: {
      saleItemId: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[];
  }) {
    return prisma.saleReturn.create({
      data: {
        saleId: data.saleId,
        userId: data.userId,
        returnDate: data.returnDate,
        reason: data.reason,
        totalAmount: data.totalAmount,
        status: "DRAFT",

        items: {
          create: data.items,
        },
      },

      include: {
        sale: {
          include: {
            customer: true,
          },
        },

        user: {
          select: userSelect,
        },

        items: {
          include: {
            saleItem: true,
            product: true,
          },
        },
      },
    });
  }

  static async getCompletedReturnedQuantity(
    saleItemId: string,
  ) {
    const result =
      await prisma.saleReturnItem.aggregate({
        where: {
          saleItemId,
          saleReturn: {
            status: "COMPLETED",
          },
        },

        _sum: {
          quantity: true,
        },
      });

    return (
      result._sum.quantity ??
      new Prisma.Decimal(0)
    );
  }
}