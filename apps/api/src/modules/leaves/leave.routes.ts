import { Router } from "express";
import { LeaveController } from "./leave.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { validate } from "../../validators/validate.js";
import {
    approveLeaveSchema,
  createLeaveSchema,
  getLeaveByIdSchema,
  updateLeaveSchema,
} from "./leave.schema.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createLeaveSchema),
  LeaveController.create,
);

router.get(
  "/",
  LeaveController.getAll,
);

router.get(
  "/:id",
  validate(getLeaveByIdSchema),
  LeaveController.getById,
);

router.patch(
  "/:id",
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(updateLeaveSchema),
  LeaveController.update,
);

router.patch(
  "/:id/approve",
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(approveLeaveSchema),
  LeaveController.approve,
);

router.patch(
  "/:id/reject",
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(approveLeaveSchema),
  LeaveController.reject,
);
    
router.delete(
  "/:id",
  authorize(UserRole.ADMIN),
  validate(getLeaveByIdSchema),
  LeaveController.delete,
);

export default router;