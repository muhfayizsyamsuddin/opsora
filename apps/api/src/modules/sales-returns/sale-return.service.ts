import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { InventoryStockService } from "../inventory-movements/inventory-stock.service.js";
import { SaleReturnRepository } from "./sale-return.repository.js";
import { SaleRepository } from "../sales/sale.repository.js";

type CreateSaleReturnInput = {
  saleId: string;
  userId: string;
  returnDate: Date;
  reason?: string;
  items: {
    saleItemId: string;
    quantity: number;
  }[];
};

type GetSaleReturnsInput = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  saleId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "returnDate" | "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
};

export class SaleReturnService {
  static async create(input: CreateSaleReturnInput) {
    const sale = await SaleRepository.findById(
      input.saleId,
    );

    if (!sale) {
      throw new AppError("Sale not found", 404);
    }

    if (sale.status !== "COMPLETED") {
      throw new AppError(
        "Only completed sales can be returned",
        400,
      );
    }

    const saleItemMap = new Map(
      sale.items.map((item) => [item.id, item]),
    );

    const seenItemIds = new Set<string>();

    const saleDiscountRatio =
      sale.subtotal.gt(0)
        ? sale.totalAmount.div(sale.subtotal)
        : new Prisma.Decimal(0);

    const items = await Promise.all(
      input.items.map(async (inputItem) => {
        if (
          seenItemIds.has(
            inputItem.saleItemId,
          )
        ) {
          throw new AppError(
            "Duplicate sale item in return",
            400,
          );
        }

        seenItemIds.add(
          inputItem.saleItemId,
        );

        const saleItem = saleItemMap.get(
          inputItem.saleItemId,
        );

        if (!saleItem) {
          throw new AppError(
            "Sale item does not belong to this sale",
            400,
          );
        }

        const requestedQuantity =
          new Prisma.Decimal(
            inputItem.quantity,
          );

        const returnedQuantity =
          await SaleReturnRepository.getCompletedReturnedQuantity(
            saleItem.id,
          );

        const remainingQuantity =
          saleItem.quantity.sub(
            returnedQuantity,
          );

        if (
          requestedQuantity.gt(
            remainingQuantity,
          )
        ) {
          throw new AppError(
            `Return quantity exceeds remaining returnable quantity for product ${saleItem.product.name}`,
            400,
          );
        }

        const quantityRatio =
          requestedQuantity.div(
            saleItem.quantity,
          );

        const itemAmountBeforeSaleDiscount =
          saleItem.subtotal.mul(
            quantityRatio,
          );

        const refundableSubtotal =
          itemAmountBeforeSaleDiscount.mul(
            saleDiscountRatio,
          );

        return {
          saleItemId: saleItem.id,
          productId: saleItem.productId,
          quantity:
            requestedQuantity.toNumber(),
          unitPrice:
            saleItem.unitPrice.toNumber(),
          subtotal:
            refundableSubtotal.toNumber(),
        };
      }),
    );

    const totalAmount = items.reduce(
      (total, item) =>
        total + item.subtotal,
      0,
    );

    return SaleReturnRepository.create({
      saleId: input.saleId,
      userId: input.userId,
      returnDate: input.returnDate,
      reason: input.reason,
      totalAmount,
      items,
    });
  }

  static async getById(id: string) {
    const saleReturn =
      await SaleReturnRepository.findById(
        id,
      );

    if (!saleReturn) {
      throw new AppError(
        "Sale return not found",
        404,
      );
    }

    return saleReturn;
  }

  static async getMany(
    input: GetSaleReturnsInput,
  ) {
    const page = input.page ?? 1;
    const perPage = input.perPage ?? 20;

    const skip =
      (page - 1) * perPage;

    const filters = {
      search: input.search,
      status: input.status,
      saleId: input.saleId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
    };

    const [data, total] =
      await Promise.all([
        SaleReturnRepository.findMany({
          skip,
          take: perPage,
          ...filters,
          sortBy: input.sortBy,
          sortOrder: input.sortOrder,
        }),

        SaleReturnRepository.count(
          filters,
        ),
      ]);

    return {
      data,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(
          total / perPage,
        ),
      },
    };
  }

  static async complete(id: string) {
    await prisma.$transaction(async (tx) => {
      const saleReturn =
        await tx.saleReturn.findUnique({
          where: {
            id,
          },
          include: {
            sale: true,
            items: {
              include: {
                saleItem: true,
                product: true,
              },
            },
          },
        });

      if (!saleReturn) {
        throw new AppError(
          "Sale return not found",
          404,
        );
      }

      if (saleReturn.sale.status !== "COMPLETED") {
        throw new AppError(
          "Only completed sales can be returned",
          400,
        );
      }

      for (const item of saleReturn.items) {
        const returnedQuantity =
          await tx.saleReturnItem.aggregate({
            where: {
              saleItemId: item.saleItemId,
              saleReturn: {
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
          item.saleItem.quantity.sub(
            alreadyReturned,
          );

        if (
          item.quantity.gt(
            remainingQuantity,
          )
        ) {
          throw new AppError(
            `Return quantity exceeds remaining returnable quantity for product ${item.product.name}`,
            400,
          );
        }
      }

      const completeResult =
        await tx.saleReturn.updateMany({
          where: {
            id: saleReturn.id,
            status: "DRAFT",
          },
          data: {
            status: "COMPLETED",
          },
        });

      if (completeResult.count !== 1) {
        throw new AppError(
          "Only DRAFT sale returns can be completed",
          400,
        );
      }

      for (const item of saleReturn.items) {
        const stockChange =
          await InventoryStockService.increaseStock(
            tx,
            item.productId,
            item.quantity,
          );

        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            userId: saleReturn.userId,
            movementType: "IN",
            referenceType: "SALE_RETURN",
            referenceId: saleReturn.id,
            quantity: item.quantity,
            beforeStock:
              stockChange.beforeStock,
            afterStock:
              stockChange.afterStock,
            reason: saleReturn.reason,
          },
        });
      }
    });

    return this.getById(id);
  }

  static async cancel(id: string) {
    await prisma.$transaction(async (tx) => {
      const saleReturn =
        await tx.saleReturn.findUnique({
          where: {
            id,
          },
        });

      if (!saleReturn) {
        throw new AppError(
          "Sale return not found",
          404,
        );
      }

      const cancelResult =
        await tx.saleReturn.updateMany({
          where: {
            id: saleReturn.id,
            status: "DRAFT",
          },
          data: {
            status: "CANCELLED",
          },
        });

      if (cancelResult.count !== 1) {
        throw new AppError(
          "Only DRAFT sale returns can be cancelled",
          400,
        );
      }
    });

    return this.getById(id);
  }
}