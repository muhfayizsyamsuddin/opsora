import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../validators/validate.js";
import { UserRole } from "../../generated/prisma/enums.js";

import { CustomerController } from "./customer.controller.js";
import {
  createCustomerSchema,
  deleteCustomerSchema,
  getCustomerByIdSchema,
  getCustomersSchema,
  updateCustomerSchema,
} from "./customer.schema.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createCustomerSchema),
  CustomerController.create,
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getCustomersSchema),
  CustomerController.getAll,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(getCustomerByIdSchema),
  CustomerController.getById,
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateCustomerSchema),
  CustomerController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(deleteCustomerSchema),
  CustomerController.delete,
);

export default router;