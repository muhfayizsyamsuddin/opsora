import { AppError } from "../../errors/AppError.js";
import { InventoryMovementRepository } from "./inventory-movement.repository.js";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { InventoryStockService } from "./inventory-stock.service.js";

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
      const adjustment = new Prisma.Decimal(quantity);

      if (adjustment.isZero()) {
        throw new AppError(
          "Adjustment quantity cannot be zero",
          400,
        );
      }

      const stockChange = adjustment.gt(0)
        ? await InventoryStockService.increaseStock(
            tx,
            productId,
            adjustment,
          )
        : await InventoryStockService.decreaseStock(
            tx,
            productId,
            adjustment.abs(),
          );

      const movement = await tx.inventoryMovement.create({
        data: {
          productId,
          userId,
          movementType: adjustment.gt(0) ? "IN" : "OUT",
          referenceType: "ADJUSTMENT",
          referenceId: null,
          quantity: adjustment.abs(),
          beforeStock: stockChange.beforeStock,
          afterStock: stockChange.afterStock,
          reason,
        },
      });

      return {
        product: stockChange.product,
        movement,
      };
    });
  }
}