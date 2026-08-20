import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
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
  requirePermission("performance_reviews.create"),
  validate(createPerformanceReviewSchema),
  PerformanceReviewController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("performance_reviews.read"),
  validate(getPerformanceReviewsSchema),
  PerformanceReviewController.getAll,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("performance_reviews.read"),
  validate(getPerformanceReviewByIdSchema),
  PerformanceReviewController.getById,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("performance_reviews.update"),
  validate(updatePerformanceReviewSchema),
  PerformanceReviewController.update,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("performance_reviews.delete"),
  validate(deletePerformanceReviewSchema),
  PerformanceReviewController.delete,
);

export default router;