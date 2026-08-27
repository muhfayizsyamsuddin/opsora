import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, success } from "../../utils/response.js";
import { SaleService } from "./sale.service.js";
import { createSaleInvoicePdf } from "./sale-invoice.pdf.js";

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
      const sales = await SaleService.getAll({
        page: Number(req.query.page ?? 1),

        perPage: Number(
          req.query.per_page ?? 20,
        ),

        search:
          req.query.search?.toString(),

        customerId:
          req.query.customer_id?.toString(),

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
            "saleDate") as
            | "saleDate"
            | "createdAt"
            | "totalAmount",

        sortOrder:
          (req.query.sort_order?.toString() ??
            "desc") as
            | "asc"
            | "desc",
      });

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

  static getInvoicePdf = asyncHandler(
    async (req: Request, res: Response) => {
      const invoice =
        await SaleService.getInvoice(
          req.params.id.toString(),
        );

      const pdf =
        createSaleInvoicePdf(invoice);

      const filename =
        `${invoice.invoiceNumber}.pdf`;

      res.setHeader(
        "Content-Type",
        "application/pdf",
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      pdf.pipe(res);
      pdf.end();
    },
  );
}