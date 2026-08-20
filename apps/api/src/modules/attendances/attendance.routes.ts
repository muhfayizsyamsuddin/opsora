import { Router } from "express";
import { AttendanceController } from "./attendance.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import {
  createAttendanceSchema,
  getAttendanceByIdSchema,
  getAttendancesSchema,
  getEmployeeAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.schema.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requirePermission("attendances.create"),
  validate(createAttendanceSchema),
  AttendanceController.create,
);

router.get(
  "/",
  requirePermission("attendances.read"),
  validate(getAttendancesSchema),
  AttendanceController.getAll,
);

router.get(
  "/employee/:employee_id",
  requirePermission("attendances.read"),
  validate(getEmployeeAttendanceSchema),
  AttendanceController.getEmployeeHistory,
);

router.get(
  "/:id",
  requirePermission("attendances.read"),
  validate(getAttendanceByIdSchema),
  AttendanceController.getById,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("attendances.update"),
  validate(updateAttendanceSchema),
  AttendanceController.update,
);

router.patch(
  "/:id",
  requirePermission("attendances.update"),
  validate(updateAttendanceSchema),
  AttendanceController.update,
);

export default router;