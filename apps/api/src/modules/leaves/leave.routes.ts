import { Router } from "express";
import { LeaveController } from "./leave.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import {
    approveLeaveSchema,
  cancelLeaveSchema,
  createLeaveSchema,
  getLeaveByIdSchema,
  getLeavesSchema,
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
  "/",
  requirePermission("leaves.read"),
  validate(getLeavesSchema),
  LeaveController.getAll,
);

router.put(
  "/:id",
  requirePermission("leaves.update"),
  validate(updateLeaveSchema),
  LeaveController.update,
);

router.post(
  "/:id/approve",
  requirePermission("leaves.approve"),
  validate(approveLeaveSchema),
  LeaveController.approve,
);

router.post(
  "/:id/reject",
  requirePermission("leaves.reject"),
  validate(approveLeaveSchema),
  LeaveController.reject,
);

router.post(
  "/:id/cancel",
  requirePermission("leaves.cancel"),
  validate(cancelLeaveSchema),
  LeaveController.cancel,
);

router.get(
  "/:id",
  requirePermission("leaves.read"),
  validate(getLeaveByIdSchema),
  LeaveController.getById,
);

export default router;