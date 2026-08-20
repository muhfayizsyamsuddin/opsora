import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../validators/validate.js";

import {
  getSettingsSchema,
  updateSettingsSchema,
} from "./setting.schema.js";
import { SettingController } from "./setting.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("settings.read"),
  validate(getSettingsSchema),
  SettingController.getAll,
);

router.patch(
  "/",
  authenticate,
  requirePermission("settings.update"),
  validate(updateSettingsSchema),
  SettingController.update,
);

export default router;