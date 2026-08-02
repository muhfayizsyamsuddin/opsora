import { Router } from "express";
import { HealthController } from "./health.controller.js";

const router = Router();

router.get(
  "/",
  HealthController.getHealth
);

export default router;