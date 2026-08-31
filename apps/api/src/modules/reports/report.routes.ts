import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { ReportController } from "./report.controller.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";
import { getReportSchema } from "./report.schema.js";

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

router.get(
  "/sales",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.getSalesReport,
);

router.get(
  "/sales/export",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.exportSalesReport,
);

router.get(
  "/purchases",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.getPurchasesReport,
);

router.get(
  "/purchases/export",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.exportPurchasesReport,
);

router.get(
  "/inventory",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.getInventoryReport,
);

router.get(
  "/inventory/export",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.exportInventoryReport,
);

router.get(
  "/profit",
  authenticate,
  requirePermission("reports.read"),
  validate(getReportSchema),
  ReportController.getProfitReport,
);

export default router;