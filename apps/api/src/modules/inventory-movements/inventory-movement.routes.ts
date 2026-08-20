import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
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
  requirePermission("inventory-movements.read"),
  validate(getInventoryMovementsSchema),
  InventoryMovementController.getAll,
);

router.post(
  "/adjust",
  authenticate,
  requirePermission("inventory-movements.adjust"),
  validate(adjustInventorySchema),
  InventoryMovementController.adjust,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("inventory-movements.read"),
  validate(getInventoryMovementByIdSchema),
  InventoryMovementController.getById,
);

export default router;