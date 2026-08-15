import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { InventoryMovementController } from "./inventory-movement.controller.js";
import {
  adjustInventorySchema,
  getInventoryMovementByIdSchema,
  getInventoryMovementsSchema,
} from "./inventory-movement.schema.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getInventoryMovementsSchema),
  InventoryMovementController.getAll,
);

router.post(
  "/adjust",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(adjustInventorySchema),
  InventoryMovementController.adjust,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getInventoryMovementByIdSchema),
  InventoryMovementController.getById,
);

export default router;