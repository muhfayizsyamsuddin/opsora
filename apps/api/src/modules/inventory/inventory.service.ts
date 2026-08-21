import { AppError } from "../../errors/AppError.js";
import { InventoryMovementService } from "../inventory-movements/inventory-movement.service.js";
import { InventoryRepository } from "./inventory.repository.js";

export class InventoryService {
  static async getStock(
    page = 1,
    perPage = 20,
    search?: string,
    sortBy: "name" | "createdAt" = "name",
    sortOrder: "asc" | "desc" = "asc",
  ) {
    return InventoryRepository.findStock(
      page,
      perPage,
      search,
      sortBy,
      sortOrder,
    );
  }

  static async getStockByProduct(
    productId: string,
  ) {
    const product =
      await InventoryRepository.findStockByProductId(
        productId,
      );

    if (!product) {
      throw new AppError(
        "Product not found",
        404,
      );
    }

    return product;
  }

  static async getMovements(
    page = 1,
    limit = 10,
    productId?: string,
    movementType?: "IN" | "OUT",
    referenceType?: "PURCHASE" | "SALE" | "ADJUSTMENT",
  ) {
    return InventoryRepository.findMovements(
      page,
      limit,
      productId,
      movementType,
      referenceType,
    );
  }

  static async getMovementById(id: string) {
    return InventoryMovementService.getById(id);
  }

  static async createAdjustment(
    productId: string,
    userId: string,
    movementType: "IN" | "OUT",
    quantity: number,
    reason: string,
  ) {
    const signedQuantity =
      movementType === "IN"
        ? quantity
        : -quantity;

    return InventoryMovementService.adjust(
      productId,
      userId,
      signedQuantity,
      reason,
    );
  }
}