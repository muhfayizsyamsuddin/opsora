import { Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../validators/validate.js";
import { UserController } from "./user.controller.js";
import { createUserSchema } from "./user.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { UserRole } from "../../generated/prisma/enums.js";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  asyncHandler(UserController.create),
);

router.get(
  "/me",
  authenticate,
  UserController.me,
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  UserController.getAll,
);

export default router;