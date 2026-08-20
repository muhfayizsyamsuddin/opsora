import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";

import { SaleController } from "./sale.controller.js";
import {
  cancelSaleSchema,
  createSaleSchema,
  getSaleByIdSchema,
  getSalesSchema,
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

router.post(
  "/:id/cancel",
  authenticate,
  requirePermission("sales.cancel"),
  validate(cancelSaleSchema),
  SaleController.cancel,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("sales.read"),
  validate(getSaleByIdSchema),
  SaleController.getById,
);

export default router;