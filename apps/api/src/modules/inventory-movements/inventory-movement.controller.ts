import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { InventoryMovementService } from "./inventory-movement.service.js";

export class InventoryMovementController {
  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(
        req.query.page ?? 1,
      );

      const perPage = Number(
        req.query.per_page ?? 20,
      );

      const productId =
        req.query.product_id?.toString();

      const movementType =
        req.query.movement_type?.toString() as
          | "IN"
          | "OUT"
          | undefined;

      const referenceType =
        req.query.reference_type?.toString() as
          | "PURCHASE"
          | "SALE"
          | "ADJUSTMENT"
          | undefined;

      const sortBy =
        (req.query.sort_by?.toString() ??
          "createdAt") as "createdAt";

      const sortOrder =
        (req.query.sort_order?.toString() ??
          "desc") as
          | "asc"
          | "desc";

      const movements =
        await InventoryMovementService.getAll(
          page,
          perPage,
          productId,
          movementType,
          referenceType,
          sortBy,
          sortOrder,
        );

      return success(
        res,
        movements,
      );
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const movement =
        await InventoryMovementService.getById(
          req.params.id.toString(),
        );

      return success(res, movement);
    },
  );

  static adjust = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await InventoryMovementService.adjust(
          req.body.productId,
          req.user!.id,
          req.body.quantity,
          req.body.reason,
        );

      return success(
        res,
        result,
        "Inventory adjusted successfully",
      );
    },
  );
}