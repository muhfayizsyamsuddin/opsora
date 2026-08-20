import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import { InventoryController } from "./inventory.controller.js";
import {
  createInventoryAdjustmentSchema,
  getInventoryMovementByIdSchema,
  getInventoryMovementsSchema,
  getInventoryStockByProductSchema,
  getInventoryStockSchema,
} from "./inventory.schema.js";

const router = Router();

router.use(authenticate);

router.get(
  "/stock",
  requirePermission("inventory-movements.read"),
  validate(getInventoryStockSchema),
  InventoryController.getStock,
);

router.get(
  "/movements/:id",
  requirePermission("inventory-movements.read"),
  validate(getInventoryMovementByIdSchema),
  InventoryController.getMovementById,
);

router.post(
  "/adjustments",
  requirePermission("inventory-movements.adjust"),
  validate(createInventoryAdjustmentSchema),
  InventoryController.createAdjustment,
);

router.get(
  "/stock/:product_id",
  requirePermission("inventory-movements.read"),
  validate(getInventoryStockByProductSchema),
  InventoryController.getStockByProduct,
);

router.get(
  "/movements",
  requirePermission("inventory-movements.read"),
  validate(getInventoryMovementsSchema),
  InventoryController.getMovements,
);

export default router;