import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { SaleController } from "./sale.controller.js";
import {
  cancelSaleSchema,
  createSaleSchema,
  getSaleByIdSchema,
  getSalesSchema,
} from "./sale.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF),
  validate(createSaleSchema),
  SaleController.create,
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getSalesSchema),
  SaleController.getAll,
);

router.post(
  "/:id/cancel",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(cancelSaleSchema),
  SaleController.cancel,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getSaleByIdSchema),
  SaleController.getById,
);

export default router;