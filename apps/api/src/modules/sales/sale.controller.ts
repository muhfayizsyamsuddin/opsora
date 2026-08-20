import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, success } from "../../utils/response.js";
import { SaleService } from "./sale.service.js";

export class SaleController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const sale = await SaleService.create({
        customerId: req.body.customerId,
        userId: req.user!.id,
        saleDate: req.body.saleDate,
        paymentMethod: req.body.paymentMethod,
        discount: req.body.discount,
        items: req.body.items,
      });

      return created(
        res,
        sale,
        "Sale created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const search = req.query.search?.toString();

      const sales = await SaleService.getAll(
        page,
        limit,
        search,
      );

      return success(res, sales);
    },
  );

  static getById = asyncHandler(
    async (req: Request, res: Response) => {
      const sale = await SaleService.getById(
        req.params.id.toString(),
      );

      return success(res, sale);
    },
  );

  static cancel = asyncHandler(
    async (req: Request, res: Response) => {
      const sale = await SaleService.cancel(
        req.params.id.toString(),
      );

      return success(
        res,
        sale,
        "Sale cancelled successfully",
      );
    },
  );

  static pay = asyncHandler(
    async (req: Request, res: Response) => {
      const sale = await SaleService.pay(
        req.params.id.toString(),
      );

      return success(
        res,
        sale,
        "Sale paid successfully",
      );
    },
  );

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const sale = await SaleService.update(
        req.params.id.toString(),
        req.body,
      );

      return success(
        res,
        sale,
        "Sale updated successfully",
      );
    },
  );

  static getInvoice = asyncHandler(
    async (req: Request, res: Response) => {
      const invoice =
        await SaleService.getInvoice(
          req.params.id.toString(),
        );

      return success(res, invoice);
    },
  );
}