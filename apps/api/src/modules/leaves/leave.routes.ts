import { Router } from "express";
import { LeaveController } from "./leave.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
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
  requirePermission("leaves.create"),
  validate(createLeaveSchema),
  LeaveController.create,
);

router.get(
  "/",
  requirePermission("leaves.read"),
  LeaveController.getAll,
);

router.get(
  "/:id",
  requirePermission("leaves.read"),
  validate(getLeaveByIdSchema),
  LeaveController.getById,
);

// router.patch(
//   "/:id",
//   authorize(UserRole.ADMIN, UserRole.MANAGER),
//   validate(updateLeaveSchema),
//   LeaveController.update,
// );

router.patch(
  "/:id/approve",
  requirePermission("leaves.approve"),
  validate(approveLeaveSchema),
  LeaveController.approve,
);

router.patch(
  "/:id/reject",
  requirePermission("leaves.reject"),
  validate(approveLeaveSchema),
  LeaveController.reject,
);
    
// router.delete(
//   "/:id",
//   authorize(UserRole.ADMIN),
//   validate(getLeaveByIdSchema),
//   LeaveController.delete,
// );

export default router;