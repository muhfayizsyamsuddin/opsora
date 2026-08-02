import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { success } from "../../utils/response.js";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  static getStatistics = asyncHandler(
    async (_req: Request, res: Response) => {
      const statistics =
        await DashboardService.getStatistics();

      return success(res, statistics);
    },
  );
}