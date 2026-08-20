import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { ReportController } from "./report.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  requirePermission("reports.read"),
  ReportController.getDashboardReport,
);

router.get(
  "/attendance",
  authenticate,
  requirePermission("reports.read"),
  ReportController.getAttendanceReport,
);

router.get(
  "/leaves",
  authenticate,
  requirePermission("reports.read"),
  ReportController.getLeaveReport,
);

router.get(
  "/payroll",
  authenticate,
  requirePermission("reports.read"),
  ReportController.getPayrollReport,
);

router.get(
  "/performance",
  authenticate,
  requirePermission("reports.read"),
  ReportController.getPerformanceReport,
);

export default router;