import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";

import { PerformanceReviewController } from "./performance-review.controller.js";

import {
  createPerformanceReviewSchema,
  updatePerformanceReviewSchema,
  getPerformanceReviewByIdSchema,
  getPerformanceReviewsSchema,
  deletePerformanceReviewSchema,
} from "./performance-review.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(createPerformanceReviewSchema),
  PerformanceReviewController.create,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(getPerformanceReviewsSchema),
  PerformanceReviewController.getAll,
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(getPerformanceReviewByIdSchema),
  PerformanceReviewController.getById,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(updatePerformanceReviewSchema),
  PerformanceReviewController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(deletePerformanceReviewSchema),
  PerformanceReviewController.delete,
);

export default router;