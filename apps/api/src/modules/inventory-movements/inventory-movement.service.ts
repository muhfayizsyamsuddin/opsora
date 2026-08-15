import { AppError } from "../../errors/AppError.js";
import { InventoryMovementRepository } from "./inventory-movement.repository.js";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

export class InventoryMovementService {
  static async getById(id: string) {
    const movement =
      await InventoryMovementRepository.findById(id);

    if (!movement) {
      throw new AppError("Inventory movement not found", 404);
    }

    return movement;
  }

  static async getAll(
    page = 1,
    limit = 10,
    productId?: string,
    movementType?: "IN" | "OUT",
    referenceType?: "PURCHASE" | "SALE" | "ADJUSTMENT",
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      InventoryMovementRepository.findMany(
        skip,
        limit,
        productId,
        movementType,
        referenceType,
      ),
      InventoryMovementRepository.count(
        productId,
        movementType,
        referenceType,
      ),
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

  static async adjust(
    productId: string,
    userId: string,
    quantity: number,
    reason: string,
  ) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: {
          id: productId,
          deletedAt: null,
        },
      });

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      const adjustment = new Prisma.Decimal(quantity);
      const beforeStock = product.stock;
      const afterStock = beforeStock.add(adjustment);

      if (afterStock.lt(0)) {
        throw new AppError(
          "Adjustment would make stock negative",
          400,
        );
      }

      const movementType =
        adjustment.gt(0) ? "IN" : "OUT";

      const movementQuantity = adjustment.abs();

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: afterStock,
        },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          productId: product.id,
          userId,
          movementType,
          referenceType: "ADJUSTMENT",
          referenceId: null,
          quantity: movementQuantity,
          beforeStock,
          afterStock,
          reason,
        },
      });

      return {
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: afterStock,
        },
        movement,
      };
    });
  }
}