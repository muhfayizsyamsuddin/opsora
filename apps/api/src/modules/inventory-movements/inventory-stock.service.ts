import { AppError } from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";

type TransactionClient = Prisma.TransactionClient;

export type StockChangeResult = {
  product: {
    id: string;
    name: string;
    stock: Prisma.Decimal;
  };
  beforeStock: Prisma.Decimal;
  afterStock: Prisma.Decimal;
};

export class InventoryStockService {
  static async increaseStock(
    tx: TransactionClient,
    productId: string,
    quantity: Prisma.Decimal,
  ): Promise<StockChangeResult> {
    if (quantity.lte(0)) {
      throw new AppError(
        "Stock increase quantity must be greater than zero",
        400,
      );
    }

    const product = await tx.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const beforeStock = product.stock;
    const afterStock = beforeStock.add(quantity);

    await tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });

    return {
      product: {
        id: product.id,
        name: product.name,
        stock: afterStock,
      },
      beforeStock,
      afterStock,
    };
  }

  static async decreaseStock(
    tx: TransactionClient,
    productId: string,
    quantity: Prisma.Decimal,
  ): Promise<StockChangeResult> {
    if (quantity.lte(0)) {
      throw new AppError(
        "Stock decrease quantity must be greater than zero",
        400,
      );
    }

    const product = await tx.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const beforeStock = product.stock;

    const updateResult = await tx.product.updateMany({
      where: {
        id: product.id,
        deletedAt: null,
        stock: {
          gte: quantity,
        },
      },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });

    if (updateResult.count !== 1) {
      throw new AppError(
        `Insufficient stock for product: ${product.name}`,
        400,
      );
    }

    const afterStock = beforeStock.sub(quantity);

    return {
      product: {
        id: product.id,
        name: product.name,
        stock: afterStock,
      },
      beforeStock,
      afterStock,
    };
  }
}