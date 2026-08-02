import { Router } from "express";
import { PayrollController } from "./payroll.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
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
  authorize("ADMIN"),
  validate(createPayrollSchema),
  PayrollController.create,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(getPayrollsSchema),
  PayrollController.getAll,
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(getPayrollByIdSchema),
  PayrollController.getById,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(deletePayrollSchema),
  PayrollController.delete,
);

export default router;