import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../validators/validate.js';
import { UserRole } from '../../generated/prisma/enums.js';

import { ProductController } from './product.controller.js';
import {
  createProductSchema,
  deleteProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  updateProductSchema,
} from './product.schema.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createProductSchema),
  ProductController.create,
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getProductsSchema),
  ProductController.getAll,
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(getProductByIdSchema),
  ProductController.getById,
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateProductSchema),
  ProductController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(deleteProductSchema),
  ProductController.delete,
);

export default router;