import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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
  purchaseId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "returnDate" | "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
};

export class PurchaseReturnRepository {
  static async findById(id: string) {
    return prisma.purchaseReturn.findUnique({
      where: { id },
      include: {
        purchase: {
          include: {
            supplier: true,
          },
        },
        user: {
          select: userSelect,
        },
        items: {
          include: {
            purchaseItem: true,
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
    purchaseId,
    dateFrom,
    dateTo,
    sortBy = "returnDate",
    sortOrder = "desc",
  }: FindManyParams) {
    return prisma.purchaseReturn.findMany({
      skip,
      take,
      where: {
        ...(status && {
          status,
        }),

        ...(purchaseId && {
          purchaseId,
        }),

        ...(search && {
          purchase: {
            supplier: {
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
        purchase: {
          include: {
            supplier: true,
          },
        },
        user: {
          select: userSelect,
        },
        items: {
          include: {
            purchaseItem: true,
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
    purchaseId,
    dateFrom,
    dateTo,
  }: Omit<
    FindManyParams,
    "skip" | "take" | "sortBy" | "sortOrder"
  >) {
    return prisma.purchaseReturn.count({
      where: {
        ...(status && {
          status,
        }),

        ...(purchaseId && {
          purchaseId,
        }),

        ...(search && {
          purchase: {
            supplier: {
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
    purchaseId: string;
    userId: string;
    returnDate: Date;
    reason?: string;
    totalAmount: number;
    items: {
      purchaseItemId: string;
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[];
  }) {
    return prisma.purchaseReturn.create({
      data: {
        purchaseId: data.purchaseId,
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
        purchase: {
          include: {
            supplier: true,
          },
        },
        user: {
          select: userSelect,
        },
        items: {
          include: {
            purchaseItem: true,
            product: true,
          },
        },
      },
    });
  }

  static async getCompletedReturnedQuantity(
    purchaseItemId: string,
  ) {
    const result = await prisma.purchaseReturnItem.aggregate({
      where: {
        purchaseItemId,
        purchaseReturn: {
          status: "COMPLETED",
        },
      },
      _sum: {
        quantity: true,
      },
    });

    return result._sum.quantity ?? new Prisma.Decimal(0);
  }
}