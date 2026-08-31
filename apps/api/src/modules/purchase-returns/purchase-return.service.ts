import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { InventoryStockService } from "../inventory-movements/inventory-stock.service.js";
import { PurchaseRepository } from "../purchases/purchase.repository.js";
import { PurchaseReturnRepository } from "./purchase-return.repository.js";

type CreatePurchaseReturnInput = {
  purchaseId: string;
  userId: string;
  returnDate: Date;
  reason?: string;
  items: {
    purchaseItemId: string;
    quantity: number;
  }[];
};

type GetPurchaseReturnsInput = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  purchaseId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "returnDate" | "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
};

export class PurchaseReturnService {
  static async create(input: CreatePurchaseReturnInput) {
    const purchase = await PurchaseRepository.findById(input.purchaseId);

    if (!purchase) {
      throw new AppError("Purchase not found");
    }

    if (purchase.status !== "COMPLETED") {
      throw new AppError(
        "Only completed purchases can be returned",
      );
    }

    const purchaseItemMap = new Map(
      purchase.items.map((item) => [item.id, item]),
    );

    const seenItemIds = new Set<string>();

    const items = await Promise.all(
      input.items.map(async (inputItem) => {
        if (seenItemIds.has(inputItem.purchaseItemId)) {
          throw new AppError("Duplicate purchase item in return");
        }

        seenItemIds.add(inputItem.purchaseItemId);

        const purchaseItem = purchaseItemMap.get(
          inputItem.purchaseItemId,
        );

        if (!purchaseItem) {
          throw new AppError(
            "Purchase item does not belong to this purchase",
          );
        }

        const requestedQuantity = new Prisma.Decimal(
          inputItem.quantity,
        );

        const returnedQuantity =
          await PurchaseReturnRepository.getCompletedReturnedQuantity(
            purchaseItem.id,
          );

        const remainingQuantity =
          purchaseItem.quantity.minus(returnedQuantity);

        if (requestedQuantity.greaterThan(remainingQuantity)) {
          throw new AppError(
            `Return quantity exceeds remaining returnable quantity for product ${purchaseItem.product.name}`,
          );
        }

        const subtotal = requestedQuantity.mul(
          purchaseItem.unitPrice,
        );

        return {
          purchaseItemId: purchaseItem.id,
          productId: purchaseItem.productId,
          quantity: requestedQuantity.toNumber(),
          unitPrice: purchaseItem.unitPrice.toNumber(),
          subtotal: subtotal.toNumber(),
        };
      }),
    );

    const totalAmount = items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    return PurchaseReturnRepository.create({
      purchaseId: input.purchaseId,
      userId: input.userId,
      returnDate: input.returnDate,
      reason: input.reason,
      totalAmount,
      items,
    });
  }

  static async complete(id: string) {
    await prisma.$transaction(async (tx) => {
      const purchaseReturn =
        await tx.purchaseReturn.findUnique({
          where: {
            id,
          },
          include: {
            purchase: true,
            items: {
              include: {
                purchaseItem: true,
                product: true,
              },
            },
          },
        });

      if (!purchaseReturn) {
        throw new AppError(
          "Purchase return not found",
          404,
        );
      }

      if (purchaseReturn.purchase.status !== "COMPLETED") {
        throw new AppError(
          "Only completed purchases can be returned",
          400,
        );
      }

      /*
      * Revalidate every item at completion time.
      *
      * Validation during create() is not enough because
      * another return may have been completed after this
      * draft was created.
      */
      for (const item of purchaseReturn.items) {
        const returnedQuantity =
          await tx.purchaseReturnItem.aggregate({
            where: {
              purchaseItemId: item.purchaseItemId,
              purchaseReturn: {
                status: "COMPLETED",
              },
            },
            _sum: {
              quantity: true,
            },
          });

        const alreadyReturned =
          returnedQuantity._sum.quantity ??
          new Prisma.Decimal(0);

        const remainingQuantity =
          item.purchaseItem.quantity.sub(
            alreadyReturned,
          );

        if (item.quantity.gt(remainingQuantity)) {
          throw new AppError(
            `Return quantity exceeds remaining returnable quantity for product ${item.product.name}`,
            400,
          );
        }
      }

      const completeResult =
        await tx.purchaseReturn.updateMany({
          where: {
            id: purchaseReturn.id,
            status: "DRAFT",
          },
          data: {
            status: "COMPLETED",
          },
        });

      if (completeResult.count !== 1) {
        throw new AppError(
          "Only DRAFT purchase returns can be completed",
          400,
        );
      }

      for (const item of purchaseReturn.items) {
        const stockChange =
          await InventoryStockService.decreaseStock(
            tx,
            item.productId,
            item.quantity,
          );

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            userId: purchaseReturn.userId,
            movementType: "OUT",
            referenceType: "PURCHASE_RETURN",
            referenceId: purchaseReturn.id,
            quantity: item.quantity,
            beforeStock: stockChange.beforeStock,
            afterStock: stockChange.afterStock,
            reason: purchaseReturn.reason,
          },
        });
      }
    });

    return this.getById(id);
  }

  static async cancel(id: string) {
    await prisma.$transaction(async (tx) => {
      const purchaseReturn =
        await tx.purchaseReturn.findUnique({
          where: {
            id,
          },
        });

      if (!purchaseReturn) {
        throw new AppError(
          "Purchase return not found",
          404,
        );
      }

      const cancelResult =
        await tx.purchaseReturn.updateMany({
          where: {
            id: purchaseReturn.id,
            status: "DRAFT",
          },
          data: {
            status: "CANCELLED",
          },
        });

      if (cancelResult.count !== 1) {
        throw new AppError(
          "Only DRAFT purchase returns can be cancelled",
          400,
        );
      }
    });

    return this.getById(id);
  }

  static async getById(id: string) {
    const purchaseReturn =
      await PurchaseReturnRepository.findById(id);

    if (!purchaseReturn) {
      throw new AppError("Purchase return not found");
    }

    return purchaseReturn;
  }

  static async getMany(
    input: GetPurchaseReturnsInput,
  ) {
    const page = input.page ?? 1;
    const perPage = input.perPage ?? 20;

    const skip = (page - 1) * perPage;

    const filters = {
      search: input.search,
      status: input.status,
      purchaseId: input.purchaseId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
    };

    const [data, total] = await Promise.all([
      PurchaseReturnRepository.findMany({
        skip,
        take: perPage,
        ...filters,
        sortBy: input.sortBy,
        sortOrder: input.sortOrder,
      }),

      PurchaseReturnRepository.count(filters),
    ]);

    return {
      data,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }
}