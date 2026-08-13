import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { PurchaseController } from "./purchase.controller.js";
import {
  createPurchaseSchema,
  getPurchaseByIdSchema,
  getPurchasesSchema,
  purchaseActionSchema,
} from "./purchase.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createPurchaseSchema),
  PurchaseController.create,
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getPurchasesSchema),
  PurchaseController.getAll,
);

router.post(
  "/:id/complete",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(purchaseActionSchema),
  PurchaseController.complete,
);

router.post(
  "/:id/cancel",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(purchaseActionSchema),
  PurchaseController.cancel,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getPurchaseByIdSchema),
  PurchaseController.getById,
);

export default router;