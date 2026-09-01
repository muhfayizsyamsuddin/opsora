import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { changePasswordSchema, loginSchema, logoutSchema, refreshTokenSchema, updateMeSchema } from "./auth.schema.js";
import { validate } from "../../validators/validate.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authLoginRateLimit, authRefreshRateLimit } from "../../middlewares/rate-limit.middleware.js";

const router = Router();

// router.post(
//   "/register",
//   validate(registerSchema),
//   AuthController.register
// );

router.post(
  "/login",
  authLoginRateLimit,
  validate(loginSchema),
  AuthController.login
)

router.get(
  "/me",
  authenticate,
  AuthController.me,
);

router.patch(
  "/me",
  authenticate,
  validate(updateMeSchema),
  AuthController.updateMe,
);

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  AuthController.changePassword,
);

router.post(
  "/refresh",
  authRefreshRateLimit,
  validate(refreshTokenSchema),
  AuthController.refresh,
);

router.post(
  "/logout",
  validate(logoutSchema),
  AuthController.logout,
);

export default router;