import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { InventoryMovementController } from "./inventory-movement.controller.js";
import {
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

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getInventoryMovementByIdSchema),
  InventoryMovementController.getById,
);

export default router;