import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, success } from "../../utils/response.js";
import { PurchaseService } from "./purchase.service.js";

export class PurchaseController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const purchase = await PurchaseService.create({
        supplierId: req.body.supplierId,
        userId: req.user!.id,
        purchaseDate: req.body.purchaseDate,
        items: req.body.items,
      });

      return created(
        res,
        purchase,
        "Purchase created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search?.toString();

      const purchases = await PurchaseService.getAll(
        page,
        limit,
        search,
      );

      return success(res, purchases);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const purchase = await PurchaseService.getById(
        req.params.id.toString(),
      );

      return success(res, purchase);
    },
  );

  static complete = asyncHandler(
    async (req: Request, res: Response) => {
      const purchase = await PurchaseService.complete(
        req.params.id.toString(),
      );

      return success(
        res,
        purchase,
        "Purchase completed successfully",
      );
    },
  );

  static cancel = asyncHandler(
    async (req: Request, res: Response) => {
      const purchase = await PurchaseService.cancel(
        req.params.id.toString(),
      );

      return success(
        res,
        purchase,
        "Purchase cancelled successfully",
      );
    },
  );
}