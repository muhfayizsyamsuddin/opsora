import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { DashboardController } from "./dashboard.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  DashboardController.getStatistics,
);

export default router;