import { Router } from "express";
import { AttendanceController } from "./attendance.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { validate } from "../../validators/validate.js";
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
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createAttendanceSchema),
  AttendanceController.create,
);

router.get(
  "/",
  validate(getAttendancesSchema),
  AttendanceController.getAll,
);

router.get(
  "/:id",
  validate(getAttendanceByIdSchema),
  AttendanceController.getById,
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(updateAttendanceSchema),
  AttendanceController.update,
);

router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(getAttendanceByIdSchema),
  AttendanceController.delete,
);

export default router;