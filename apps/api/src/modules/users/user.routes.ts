import { Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../validators/validate.js";
import { UserController } from "./user.controller.js";
import { createUserSchema } from "./user.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  asyncHandler(UserController.create),
);
router.get(
  "/me",
  authenticate,
  UserController.me
);

export default router;