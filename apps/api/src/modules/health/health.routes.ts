import { Router } from "express";
import { HealthController } from "./health.controller.js";
import { validate } from "../../validators/validate.js";
import { healthSchema } from "./health.schema.js";

const router = Router();

router.get("/", validate(healthSchema), HealthController.getHealth);

export default router;