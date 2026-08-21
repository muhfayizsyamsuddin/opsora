import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { EmployeeController } from "./employee.controller.js";
import {
  createEmployeeSchema,
  getEmployeeByIdSchema,
  getEmployeesSchema,
  updateEmployeeSchema,
} from "./employee.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("employees.create"),
  validate(createEmployeeSchema),
  EmployeeController.create,
);
router.get(
  "/",
  authenticate,
  requirePermission("employees.read"),
  validate(getEmployeesSchema),
  EmployeeController.getAll,
);
router.get(
  "/:id",
  authenticate,
  requirePermission("employees.read"),
  validate(getEmployeeByIdSchema),
  EmployeeController.getById,
);
router.put(
  "/:id",
  authenticate,
  requirePermission("employees.update"),
  validate(updateEmployeeSchema),
  EmployeeController.update,
);
router.delete(
  "/:id",
  authenticate,
  requirePermission("employees.delete"),
  validate(getEmployeeByIdSchema),
  EmployeeController.delete,
);

export default router;