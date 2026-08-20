import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import {
  createRoleSchema,
  deleteRoleSchema,
  getRoleByIdSchema,
  getRolesSchema,
  updateRolePermissionsSchema,
  updateRoleSchema,
} from "./role.schema.js";
import { RoleController } from "./role.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("roles.read"),
  validate(getRolesSchema),
  RoleController.getAll,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("roles.read"),
  validate(getRoleByIdSchema),
  RoleController.getById,
);

router.post(
  "/",
  authenticate,
  requirePermission("roles.create"),
  validate(createRoleSchema),
  RoleController.create,
);

router.put(
  "/:id/permissions",
  authenticate,
  requirePermission("roles.update"),
  validate(updateRolePermissionsSchema),
  RoleController.updatePermissions,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("roles.update"),
  validate(updateRoleSchema),
  RoleController.update,
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("roles.update"),
  validate(updateRoleSchema),
  RoleController.update,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("roles.delete"),
  validate(deleteRoleSchema),
  RoleController.delete,
);

export default router;