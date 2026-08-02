import { Router } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { validate } from "../../validators/validate.js";
import { UserController } from "./user.controller.js";
import { createUserSchema } from "./user.schema.js";

const router = Router();

router.post(
  "/",
  validate(createUserSchema),
  asyncHandler(UserController.create),
);

export default router;