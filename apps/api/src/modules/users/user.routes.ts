import { Router } from "express";

import { UserController } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { updateUserSchema } from "./user.schema.js";
import { validate } from "../../validators/validate.js";

const router = Router();

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
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  UserController.getById,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateUserSchema),
  UserController.update,
);

export default router;