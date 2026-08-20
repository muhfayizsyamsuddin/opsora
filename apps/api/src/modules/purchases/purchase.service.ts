import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { InventoryStockService } from "../inventory-movements/inventory-stock.service.js";

type PurchaseItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

type CreatePurchaseInput = {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: PurchaseItemInput[];
};

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

export class PurchaseService {
  static async create(data: CreatePurchaseInput) {
    if (data.items.length === 0) {
      throw new AppError("Purchase must contain at least one item", 400);
    }

    return prisma.$transaction(async (tx) => {
      const supplier = await tx.supplier.findFirst({
        where: {
          id: data.supplierId,
          deletedAt: null,
        },
      });

      if (!supplier) {
        throw new AppError("Supplier not found", 404);
      }

      const productIds = data.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          deletedAt: null,
        },
      });

      if (products.length !== productIds.length) {
        throw new AppError("One or more products not found", 404);
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      const purchaseItems = data.items.map((item) => {
        if (item.quantity <= 0) {
          throw new AppError(
            "Purchase quantity must be greater than zero",
            400,
          );
        }

        if (item.unitPrice < 0) {
          throw new AppError(
            "Purchase unit price cannot be negative",
            400,
          );
        }

        if (!productMap.has(item.productId)) {
          throw new AppError("Product not found", 404);
        }

        const subtotal = item.quantity * item.unitPrice;

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
        };
      });

      const totalAmount = purchaseItems.reduce(
        (total, item) => total + item.subtotal,
        0,
      );

      const purchase = await tx.purchase.create({
        data: {
          supplierId: data.supplierId,
          userId: data.userId,
          purchaseDate: data.purchaseDate,
          totalAmount,
        },
      });

      await tx.purchaseItem.createMany({
        data: purchaseItems.map((item) => ({
          purchaseId: purchase.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      });

      return tx.purchase.findUnique({
        where: {
          id: purchase.id,
        },
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
    });
  }

  static async complete(id: string) {
    return prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });

      if (!purchase) {
        throw new AppError("Purchase not found", 404);
      }

      if (purchase.status !== "DRAFT") {
        throw new AppError(
          "Only DRAFT purchases can be completed",
          400,
        );
      }

      for (const item of purchase.items) {
        const quantity = new Prisma.Decimal(item.quantity);

        const stockChange =
          await InventoryStockService.increaseStock(
            tx,
            item.productId,
            quantity,
          );

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            userId: purchase.userId,
            movementType: "IN",
            referenceType: "PURCHASE",
            referenceId: purchase.id,
            quantity,
            beforeStock: stockChange.beforeStock,
            afterStock: stockChange.afterStock,
          },
        });
      }

      await tx.purchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          status: "COMPLETED",
        },
      });

      return tx.purchase.findUnique({
        where: {
          id: purchase.id,
        },
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
    });
  }

  static async cancel(id: string) {
    return prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: {
          id,
        },
      });

      if (!purchase) {
        throw new AppError("Purchase not found", 404);
      }

      if (purchase.status !== "DRAFT") {
        throw new AppError(
          "Only DRAFT purchases can be cancelled",
          400,
        );
      }

      await tx.purchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      return tx.purchase.findUnique({
        where: {
          id: purchase.id,
        },
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
    });
  }

  static async getAll(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        prisma.purchase.findMany({
        skip,
        take: limit,
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
        }),
        prisma.purchase.count({
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
        }),
    ]);

    return {
        data,
        meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        },
    };
  }

  static async getById(id: string) {
    const purchase = await prisma.purchase.findUnique({
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

    if (!purchase) {
        throw new AppError("Purchase not found", 404);
    }

    return purchase;
  }

  static async update(
    id: string,
    data: {
      supplierId?: string;
      purchaseDate?: Date;
      items?: PurchaseItemInput[];
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!purchase) {
        throw new AppError(
          "Purchase not found",
          404,
        );
      }

      if (purchase.status !== "DRAFT") {
        throw new AppError(
          "Only DRAFT purchases can be updated",
          400,
        );
      }

      if (data.supplierId !== undefined) {
        const supplier = await tx.supplier.findFirst({
          where: {
            id: data.supplierId,
            deletedAt: null,
          },
        });

        if (!supplier) {
          throw new AppError(
            "Supplier not found",
            404,
          );
        }
      }

      let totalAmount = purchase.totalAmount;

      if (data.items) {
        const productIds = data.items.map(
          (item) => item.productId,
        );

        const products = await tx.product.findMany({
          where: {
            id: {
              in: productIds,
            },
            deletedAt: null,
          },
        });

        if (products.length !== productIds.length) {
          throw new AppError(
            "One or more products not found",
            404,
          );
        }

        const purchaseItems = data.items.map(
          (item) => {
            if (item.quantity <= 0) {
              throw new AppError(
                "Purchase quantity must be greater than zero",
                400,
              );
            }

            if (item.unitPrice < 0) {
              throw new AppError(
                "Purchase unit price cannot be negative",
                400,
              );
            }

            const subtotal =
              item.quantity * item.unitPrice;

            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal,
            };
          },
        );

        totalAmount = new Prisma.Decimal(
          purchaseItems.reduce(
            (total, item) => total + item.subtotal,
            0,
          ),
        );

        await tx.purchaseItem.deleteMany({
          where: {
            purchaseId: id,
          },
        });

        await tx.purchaseItem.createMany({
          data: purchaseItems.map((item) => ({
            purchaseId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        });
      }

      await tx.purchase.update({
        where: {
          id,
        },
        data: {
          supplierId:
            data.supplierId ??
            purchase.supplierId,
          purchaseDate:
            data.purchaseDate ??
            purchase.purchaseDate,
          totalAmount,
        },
      });

      return tx.purchase.findUnique({
        where: {
          id,
        },
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
    });
  }
}