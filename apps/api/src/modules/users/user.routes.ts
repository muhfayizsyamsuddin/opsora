import { Router } from "express";

import { UserController } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getUsersSchema,
  updateUserSchema,
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

router.get(
  "/:id",
  authenticate,
  requirePermission("users.read"),
  UserController.getById,
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("users.update"),
  validate(updateUserSchema),
  UserController.update,
);

export default router;