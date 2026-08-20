import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../validators/validate.js';

import { ProductController } from './product.controller.js';
import {
  createProductSchema,
  deleteProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  updateProductSchema,
} from './product.schema.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("products.create"),
  validate(createProductSchema),
  ProductController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("products.read"),
  validate(getProductsSchema),
  ProductController.getAll,
);

router.post(
  "/:id/image",
  authenticate,
  requirePermission("products.update"),
  upload.single("image"),
  ProductController.uploadImage,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("products.read"),
  validate(getProductByIdSchema),
  ProductController.getById,
);

router.put(
  "/:id",
  authenticate,
  requirePermission("products.update"),
  validate(updateProductSchema),
  ProductController.update,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("products.delete"),
  validate(deleteProductSchema),
  ProductController.delete,
);

export default router;