import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";

import { PurchaseController } from "./purchase.controller.js";
import {
  createPurchaseSchema,
  getPurchaseByIdSchema,
  getPurchasesSchema,
  purchaseActionSchema,
  updatePurchaseSchema,
} from "./purchase.schema.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("purchases.create"),
  validate(createPurchaseSchema),
  PurchaseController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("purchases.read"),
  validate(getPurchasesSchema),
  PurchaseController.getAll,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("purchases.update"),
  validate(updatePurchaseSchema),
  PurchaseController.update,
);

router.post(
  "/:id/complete",
  authenticate,
  requirePermission("purchases.complete"),
  validate(purchaseActionSchema),
  PurchaseController.complete,
);

router.post(
  "/:id/cancel",
  authenticate,
  requirePermission("purchases.cancel"),
  validate(purchaseActionSchema),
  PurchaseController.cancel,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("purchases.read"),
  validate(getPurchaseByIdSchema),
  PurchaseController.getById,
);

export default router;