import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, success } from "../../utils/response.js";
import { PurchaseReturnService } from "./purchase-return.service.js";

export class PurchaseReturnController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const purchaseReturn =
        await PurchaseReturnService.create({
          purchaseId: req.body.purchaseId,
          userId: req.user!.id,
          returnDate: req.body.returnDate,
          reason: req.body.reason,
          items: req.body.items,
        });

      return created(
        res,
        purchaseReturn,
        "Purchase return created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const purchaseReturns =
        await PurchaseReturnService.getMany({
          page: Number(req.query.page ?? 1),
          perPage: Number(req.query.per_page ?? 20),

          search: req.query.search?.toString(),

          status: req.query.status?.toString() as
            | "DRAFT"
            | "COMPLETED"
            | "CANCELLED"
            | undefined,

          purchaseId:
            req.query.purchase_id?.toString(),

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
              "returnDate") as
              | "returnDate"
              | "createdAt"
              | "totalAmount",

          sortOrder:
            (req.query.sort_order?.toString() ??
              "desc") as "asc" | "desc",
        });

      return success(res, purchaseReturns);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const purchaseReturn =
        await PurchaseReturnService.getById(
          req.params.id.toString(),
        );

      return success(res, purchaseReturn);
    },
  );

  static complete = asyncHandler(
    async (req: Request, res: Response) => {
      const purchaseReturn =
        await PurchaseReturnService.complete(
          req.params.id.toString(),
        );

      return success(
        res,
        purchaseReturn,
        "Purchase return completed successfully",
      );
    },
  );

  static cancel = asyncHandler(
    async (req: Request, res: Response) => {
      const purchaseReturn =
        await PurchaseReturnService.cancel(
          req.params.id.toString(),
        );

      return success(
        res,
        purchaseReturn,
        "Purchase return cancelled successfully",
      );
    },
  );
}