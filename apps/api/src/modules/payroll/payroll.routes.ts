import { Router } from "express";

import { PayrollController } from "./payroll.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import {
  createPayrollSchema,
  getPayrollsSchema,
  getPayrollByIdSchema,
  deletePayrollSchema,
} from "./payroll.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("payroll.create"),
  validate(createPayrollSchema),
  PayrollController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("payroll.read"),
  validate(getPayrollsSchema),
  PayrollController.getAll,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("payroll.read"),
  validate(getPayrollByIdSchema),
  PayrollController.getById,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("payroll.delete"),
  validate(deletePayrollSchema),
  PayrollController.delete,
);

export default router;