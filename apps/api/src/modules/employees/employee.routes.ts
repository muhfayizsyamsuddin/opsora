import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";

import { UserRole } from "../../generated/prisma/enums.js";

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
  authorize(UserRole.ADMIN),
  validate(createEmployeeSchema),
  EmployeeController.create,
);
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getEmployeesSchema),
  EmployeeController.getAll,
);
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getEmployeeByIdSchema),
  EmployeeController.getById,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateEmployeeSchema),
  EmployeeController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getEmployeeByIdSchema),
  EmployeeController.delete,
);

export default router;