import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import { SaleReturnController } from "./sale-return.controller.js";
import {
  cancelSaleReturnSchema,
  completeSaleReturnSchema,
  createSaleReturnSchema,
  getSaleReturnSchema,
  getSaleReturnsSchema,
} from "./sale-return.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("sales.create"),
  validate(createSaleReturnSchema),
  SaleReturnController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleReturnsSchema),
  SaleReturnController.getAll,
);

router.post(
  "/:id/complete",
  authenticate,
  requirePermission("sales.pay"),
  validate(completeSaleReturnSchema),
  SaleReturnController.complete,
);

router.post(
  "/:id/cancel",
  authenticate,
  requirePermission("sales.cancel"),
  validate(cancelSaleReturnSchema),
  SaleReturnController.cancel,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleReturnSchema),
  SaleReturnController.getById,
);

export default router;