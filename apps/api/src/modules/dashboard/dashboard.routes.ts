import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { DashboardController } from "./dashboard.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("dashboard.read"),
  DashboardController.getStatistics,
);

router.get(
  "/summary",
  authenticate,
  requirePermission("dashboard.read"),
  DashboardController.getSummary,
);

router.get(
  "/recent-transactions",
  authenticate,
  requirePermission("dashboard.read"),
  DashboardController.getRecentTransactions,
);

router.get(
  "/low-stock",
  authenticate,
  requirePermission("dashboard.read"),
  DashboardController.getLowStock,
);

router.get(
  "/people-summary",
  authenticate,
  requirePermission("dashboard.read"),
  DashboardController.getPeopleSummary,
);

export default router;