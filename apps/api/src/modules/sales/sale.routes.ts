import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";

import { SaleController } from "./sale.controller.js";
import {
  cancelSaleSchema,
  createSaleSchema,
  getSaleByIdSchema,
  getSaleInvoiceSchema,
  getSalesSchema,
  paySaleSchema,
  updateSaleSchema,
} from "./sale.schema.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("sales.create"),
  validate(createSaleSchema),
  SaleController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("sales.read"),
  validate(getSalesSchema),
  SaleController.getAll,
);

router.get(
  "/:id/invoice",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleInvoiceSchema),
  SaleController.getInvoice,
);

router.get(
  "/:id/invoice/pdf",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleInvoiceSchema),
  SaleController.getInvoicePdf,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("sales.update"),
  validate(updateSaleSchema),
  SaleController.update,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleByIdSchema),
  SaleController.getById,
);

router.post(
  "/:id/pay",
  authenticate,
  requirePermission("sales.pay"),
  validate(paySaleSchema),
  SaleController.pay,
);

router.post(
  "/:id/cancel",
  authenticate,
  requirePermission("sales.cancel"),
  validate(cancelSaleSchema),
  SaleController.cancel,
);


export default router;