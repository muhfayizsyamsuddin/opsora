import { Router } from "express";
import { AttendanceController } from "./attendance.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import {
  createAttendanceSchema,
  getAttendanceByIdSchema,
  getAttendancesSchema,
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
  "/:id",
  requirePermission("attendances.read"),
  validate(getAttendanceByIdSchema),
  AttendanceController.getById,
);

router.patch(
  "/:id",
  requirePermission("attendances.update"),
  validate(updateAttendanceSchema),
  AttendanceController.update,
);

// router.delete(
//   "/:id",
//   authorize(UserRole.ADMIN),
//   validate(getAttendanceByIdSchema),
//   AttendanceController.delete,
// );

export default router;