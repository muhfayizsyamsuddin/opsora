import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { DepartmentController } from "./department.controller.js";
import { createDepartmentSchema, deleteDepartmentSchema, getDepartmentByIdSchema, updateDepartmentSchema } from "./department.schema.js";
import { getDepartmentsSchema } from "./department.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createDepartmentSchema),
  DepartmentController.create,
);
router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getDepartmentsSchema),
  DepartmentController.getAll,
);
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getDepartmentByIdSchema),
  DepartmentController.getById,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateDepartmentSchema),
  DepartmentController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(deleteDepartmentSchema),
  DepartmentController.delete,
);

export default router;