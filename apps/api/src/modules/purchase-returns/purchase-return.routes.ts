import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";
import { PurchaseReturnController } from "./purchase-return.controller.js";
import {
  cancelPurchaseReturnSchema,
  completePurchaseReturnSchema,
  createPurchaseReturnSchema,
  getPurchaseReturnSchema,
  getPurchaseReturnsSchema,
} from "./purchase-return.schema.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authenticate,
  requirePermission("purchases.create"),
  validate(createPurchaseReturnSchema),
  PurchaseReturnController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("purchases.read"),
  validate(getPurchaseReturnsSchema),
  PurchaseReturnController.getAll,
);

router.post(
  "/:id/complete",
  authenticate,
  requirePermission("purchases.complete"),
  validate(completePurchaseReturnSchema),
  PurchaseReturnController.complete,
);

router.post(
  "/:id/cancel",
  authenticate,
  requirePermission("purchases.cancel"),
  validate(cancelPurchaseReturnSchema),
  PurchaseReturnController.cancel,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("purchases.read"),
  validate(getPurchaseReturnSchema),
  PurchaseReturnController.getById,
);

export default router;