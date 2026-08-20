import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../validators/validate.js';
import { CategoryController } from './category.controller.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from './category.schema.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requirePermission("categories.create"),
  validate(createCategorySchema),
  CategoryController.create,
);

router.get(
  '/',
  authenticate,
  requirePermission("categories.read"),
  validate(getCategoriesSchema),
  CategoryController.getAll,
);

router.get(
  '/:id',
  authenticate,
  requirePermission("categories.read"),
  validate(getCategoryByIdSchema),
  CategoryController.getById,
);

router.put(
  '/:id',
  authenticate,
  requirePermission("categories.update"),
  validate(updateCategorySchema),
  CategoryController.update,
);

router.delete(
  '/:id',
  authenticate,
  requirePermission("categories.delete"),
  validate(deleteCategorySchema),
  CategoryController.delete,
);

export default router;