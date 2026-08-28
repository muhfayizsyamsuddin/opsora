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
        status: "ACTIVE",
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const updatedProducts =
      await tx.product.updateManyAndReturn({
        where: {
          id: product.id,
          deletedAt: null,
          status: "ACTIVE",
        },
        data: {
          stock: {
            increment: quantity,
          },
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
      });

    const updatedProduct = updatedProducts[0];

    if (!updatedProduct) {
      throw new AppError(
        "Product not found",
        404,
      );
    }

    const afterStock = updatedProduct.stock;
    const beforeStock = afterStock.sub(quantity);

    return {
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
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
        status: "ACTIVE",
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const updatedProducts =
      await tx.product.updateManyAndReturn({
        where: {
          id: product.id,
          deletedAt: null,
          status: "ACTIVE",
          stock: {
            gte: quantity,
          },
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
      });

    const updatedProduct = updatedProducts[0];

    if (!updatedProduct) {
      throw new AppError(
        `Insufficient stock for product: ${product.name}`,
        400,
      );
    }

    const afterStock = updatedProduct.stock;
    const beforeStock = afterStock.add(quantity);

    return {
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        stock: afterStock,
      },
      beforeStock,
      afterStock,
    };
  }
}