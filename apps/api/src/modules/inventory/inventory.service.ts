import { AppError } from "../../errors/AppError.js";
import { InventoryRepository } from "./inventory.repository.js";

export class InventoryService {
  static async getStock(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return InventoryRepository.findStock(
      page,
      limit,
      search,
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
}