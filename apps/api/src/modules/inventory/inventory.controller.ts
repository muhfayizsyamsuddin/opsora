import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { InventoryService } from "./inventory.service.js";

export class InventoryController {
  static getStock = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await InventoryService.getStock(
          Number(req.query.page ?? 1),
          Number(req.query.per_page ?? 20),
          req.query.search?.toString(),
          (req.query.sort_by?.toString() ??
            "name") as
            | "name"
            | "createdAt",
          (req.query.sort_order?.toString() ??
            "asc") as
            | "asc"
            | "desc",
        );

      return success(res, result);
    },
  );

  static getStockByProduct = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await InventoryService.getStockByProduct(
          req.params.product_id.toString(),
        );

      return success(res, result);
    },
  );

  static getMovements = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await InventoryService.getMovements(
          Number(req.query.page ?? 1),
          Number(req.query.per_page ?? 20),

          req.query.product_id?.toString(),

          req.query.movement_type?.toString() as
            | "IN"
            | "OUT"
            | undefined,

          req.query.reference_type?.toString() as
            | "PURCHASE"
            | "SALE"
            | "ADJUSTMENT"
            | undefined,

          "createdAt",

          (req.query.sort_order?.toString() ??
            "desc") as
            | "asc"
            | "desc",
        );

      return success(res, result);
    },
  );

  static getMovementById = asyncHandler(
    async (req: Request, res: Response) => {
      const movement =
        await InventoryService.getMovementById(
          req.params.id.toString(),
        );

      return success(res, movement);
    },
  );

  static createAdjustment = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await InventoryService.createAdjustment(
          req.body.product_id,
          req.user!.id,
          req.body.movement_type,
          req.body.quantity,
          req.body.reason,
        );

      return success(
        res,
        result,
        "Inventory adjustment created successfully",
      );
    },
  );
}