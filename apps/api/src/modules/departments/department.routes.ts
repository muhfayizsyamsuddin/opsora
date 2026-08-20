import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { DepartmentController } from "./department.controller.js";
import { createDepartmentSchema, deleteDepartmentSchema, getDepartmentByIdSchema, updateDepartmentSchema } from "./department.schema.js";
import { getDepartmentsSchema } from "./department.schema.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("departments.create"),
  validate(createDepartmentSchema),
  DepartmentController.create,
);
router.get(
  "/",
  authenticate,
  requirePermission("departments.read"),
  validate(getDepartmentsSchema),
  DepartmentController.getAll,
);
router.get(
  "/:id",
  authenticate,
  requirePermission("departments.read"),
  validate(getDepartmentByIdSchema),
  DepartmentController.getById,
);
router.put(
  "/:id",
  authenticate,
  requirePermission("departments.update"),
  validate(updateDepartmentSchema),
  DepartmentController.update,
);
router.patch(
  "/:id",
  authenticate,
  requirePermission("departments.update"),
  validate(updateDepartmentSchema),
  DepartmentController.update,
);
router.delete(
  "/:id",
  authenticate,
  requirePermission("departments.delete"),
  validate(deleteDepartmentSchema),
  DepartmentController.delete,
);

export default router;