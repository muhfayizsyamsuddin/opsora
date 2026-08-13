import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../validators/validate.js';
import { UserRole } from '../../generated/prisma/enums.js';
import { SupplierController } from './supplier.controller.js';
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
  authorize(UserRole.ADMIN),
  validate(createSupplierSchema),
  SupplierController.create,
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getSuppliersSchema),
  SupplierController.getAll,
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getSupplierByIdSchema),
  SupplierController.getById,
);

router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateSupplierSchema),
  SupplierController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  validate(deleteSupplierSchema),
  SupplierController.delete,
);

export default router;