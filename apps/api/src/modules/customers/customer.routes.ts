import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../validators/validate.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
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
  requirePermission("customers.create"),
  validate(createCustomerSchema),
  CustomerController.create,
);

router.get(
  "/",
  authenticate,
  requirePermission("customers.read"),
  validate(getCustomersSchema),
  CustomerController.getAll,
);

router.get(
  "/:id",
  authenticate,
  requirePermission("customers.read"),
  validate(getCustomerByIdSchema),
  CustomerController.getById,
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("customers.update"),
  validate(updateCustomerSchema),
  CustomerController.update,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("customers.delete"),
  validate(deleteCustomerSchema),
  CustomerController.delete,
);

export default router;