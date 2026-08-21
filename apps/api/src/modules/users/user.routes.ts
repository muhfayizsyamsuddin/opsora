import { Router } from "express";

import { UserController } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getUsersSchema,
  updateUserSchema,
  assignUserRoleSchema,
  deleteUserSchema,
  getUserPermissionsSchema,
  createUserSchema,
} from "./user.schema.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  UserController.me,
);

router.get(
  "/",
  authenticate,
  requirePermission("users.read"),
  validate(getUsersSchema),
  UserController.getAll,
);

router.post(
  "/",
  authenticate,
  requirePermission("users.create"),
  validate(createUserSchema),
  UserController.create,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("users.read"),
  UserController.getById,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("users.update"),
  validate(updateUserSchema),
  UserController.update,
);

router.put(
  "/:id/roles",
  authenticate,
  requirePermission("users.update"),
  validate(assignUserRoleSchema),
  UserController.assignRole,
);

router.get(
  "/:id/permissions",
  authenticate,
  requirePermission("users.read"),
  validate(getUserPermissionsSchema),
  UserController.getPermissions,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("users.delete"),
  validate(deleteUserSchema),
  UserController.delete,
);

export default router;