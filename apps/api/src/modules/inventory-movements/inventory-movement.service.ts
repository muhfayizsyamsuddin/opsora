import { AppError } from "../../errors/AppError.js";
import { InventoryMovementRepository } from "./inventory-movement.repository.js";

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
}