import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { SettingService } from "./setting.service.js";

export class SettingController {
  static getAll = asyncHandler(
    async (_req: Request, res: Response) => {
      const settings = await SettingService.getAll();

      return success(res, settings);
    },
  );

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const settings = await SettingService.update(
        req.body,
      );

      return success(
        res,
        settings,
        "Settings updated successfully",
      );
    },
  );
}