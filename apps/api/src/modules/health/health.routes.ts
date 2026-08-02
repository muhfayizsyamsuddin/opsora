import { Router } from "express";
import { HealthController } from "./health.controller.js";
import { healthSchema } from "./health.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(healthSchema),
  HealthController.getHealth
);

export default router;