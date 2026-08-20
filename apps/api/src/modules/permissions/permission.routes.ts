import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import {
  getPermissionByIdSchema,
  getPermissionsSchema,
} from "./permission.schema.js";
import { PermissionController } from "./permission.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("permissions.read"),
  validate(getPermissionsSchema),
  PermissionController.getAll,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("permissions.read"),
  validate(getPermissionByIdSchema),
  PermissionController.getById,
);

export default router;