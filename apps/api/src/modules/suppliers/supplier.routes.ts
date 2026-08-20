import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../validators/validate.js';
import { SupplierController } from './supplier.controller.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import {
  createSupplierSchema,
  deleteSupplierSchema,
  getSupplierByIdSchema,
  getSuppliersSchema,
  updateSupplierSchema,
} from './supplier.schema.js';

const router = Router();

router.post(
  '/',
  authenticate,
  requirePermission("suppliers.create"),
  validate(createSupplierSchema),
  SupplierController.create,
);

router.get(
  '/',
  authenticate,
  requirePermission("suppliers.read"),
  validate(getSuppliersSchema),
  SupplierController.getAll,
);

router.get(
  '/:id',
  authenticate,
  requirePermission("suppliers.read"),
  validate(getSupplierByIdSchema),
  SupplierController.getById,
);

router.patch(
  '/:id',
  authenticate,
  requirePermission("suppliers.update"),
  validate(updateSupplierSchema),
  SupplierController.update,
);

router.delete(
  '/:id',
  authenticate,
  requirePermission("suppliers.delete"),
  validate(deleteSupplierSchema),
  SupplierController.delete,
);

export default router;