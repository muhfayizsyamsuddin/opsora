import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { InventoryMovementService } from "./inventory-movement.service.js";

export class InventoryMovementController {
  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const productId = req.query.productId?.toString();

      const movementType = req.query.movementType?.toString() as
        | "IN"
        | "OUT"
        | undefined;

      const referenceType = req.query.referenceType?.toString() as
        | "PURCHASE"
        | "SALE"
        | "ADJUSTMENT"
        | undefined;

      const movements =
        await InventoryMovementService.getAll(
          page,
          limit,
          productId,
          movementType,
          referenceType,
        );

      return success(res, movements);
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