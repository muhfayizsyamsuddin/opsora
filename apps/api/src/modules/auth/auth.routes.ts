import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { loginSchema, logoutSchema, refreshTokenSchema, registerSchema } from "./auth.schema.js";
import { validate } from "../../validators/validate.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
)

router.get(
  "/me",
  authenticate,
  AuthController.me,
);

router.post(
  "/refresh",
  validate(refreshTokenSchema),
  AuthController.refresh,
);

router.post(
  "/logout",
  validate(logoutSchema),
  AuthController.logout,
);

export default router;