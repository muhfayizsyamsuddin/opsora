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
      const purchases =
        await PurchaseService.getAll({
          page: Number(
            req.query.page ?? 1,
          ),

          perPage: Number(
            req.query.per_page ?? 20,
          ),

          search:
            req.query.search?.toString(),

          supplierId:
            req.query.supplier_id?.toString(),

          dateFrom: req.query.date_from
            ? new Date(
                req.query.date_from.toString(),
              )
            : undefined,

          dateTo: req.query.date_to
            ? new Date(
                req.query.date_to.toString(),
              )
            : undefined,

          sortBy:
            (req.query.sort_by?.toString() ??
              "purchaseDate") as
              | "purchaseDate"
              | "createdAt"
              | "totalAmount",

          sortOrder:
            (req.query.sort_order?.toString() ??
              "desc") as
              | "asc"
              | "desc",
        });

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

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const purchase =
        await PurchaseService.update(
          req.params.id.toString(),
          req.body,
        );

      return success(
        res,
        purchase,
        "Purchase updated successfully",
      );
    },
  );
}