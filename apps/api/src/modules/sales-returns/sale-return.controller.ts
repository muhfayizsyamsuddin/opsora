import type { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, success } from "../../utils/response.js";
import { SaleReturnService } from "./sale-return.service.js";

export class SaleReturnController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const saleReturn =
        await SaleReturnService.create({
          saleId: req.body.saleId,
          userId: req.user!.id,
          returnDate: req.body.returnDate,
          reason: req.body.reason,
          items: req.body.items,
        });

      return created(
        res,
        saleReturn,
        "Sale return created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const saleReturns =
        await SaleReturnService.getMany({
          page: Number(req.query.page ?? 1),
          perPage: Number(req.query.per_page ?? 20),

          search: req.query.search?.toString(),

          status: req.query.status?.toString() as
            | "DRAFT"
            | "COMPLETED"
            | "CANCELLED"
            | undefined,

          saleId:
            req.query.sale_id?.toString(),

          dateFrom: req.query.date_from
            ? new Date(req.query.date_from.toString())
            : undefined,

          dateTo: req.query.date_to
            ? new Date(req.query.date_to.toString())
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

      return success(res, saleReturns);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const saleReturn =
        await SaleReturnService.getById(
          req.params.id.toString(),
        );

      return success(res, saleReturn);
    },
  );

  static complete = asyncHandler(
    async (req: Request, res: Response) => {
      const saleReturn =
        await SaleReturnService.complete(
          req.params.id.toString(),
        );

      return success(
        res,
        saleReturn,
        "Sale return completed successfully",
      );
    },
  );

  static cancel = asyncHandler(
    async (req: Request, res: Response) => {
      const saleReturn =
        await SaleReturnService.cancel(
          req.params.id.toString(),
        );

      return success(
        res,
        saleReturn,
        "Sale return cancelled successfully",
      );
    },
  );
}