import { Router } from "express";

import { UserController } from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { UserRole } from "../../generated/prisma/enums.js";

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

export default router;