import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../validators/validate.js';
import { UserRole } from '../../generated/prisma/enums.js';

import { CategoryController } from './category.controller.js';
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
  authorize(UserRole.ADMIN),
  validate(createCategorySchema),
  CategoryController.create,
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getCategoriesSchema),
  CategoryController.getAll,
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getCategoryByIdSchema),
  CategoryController.getById,
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateCategorySchema),
  CategoryController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(deleteCategorySchema),
  CategoryController.delete,
);

export default router;