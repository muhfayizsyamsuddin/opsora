import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { ReportController } from "./report.controller.js";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ReportController.getDashboardReport,
);

router.get(
  "/attendance",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ReportController.getAttendanceReport,
);

router.get(
  "/leaves",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ReportController.getLeaveReport,
);

router.get(
  "/payroll",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ReportController.getPayrollReport,
);

router.get(
  "/performance",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ReportController.getPerformanceReport,
);

export default router;