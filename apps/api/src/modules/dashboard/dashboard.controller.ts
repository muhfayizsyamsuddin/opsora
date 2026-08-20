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

  static getSummary = asyncHandler(
    async (_req: Request, res: Response) => {
      const data =
        await DashboardService.getSummary();

      return success(res, data);
    },
  );

  static getRecentTransactions = asyncHandler(
    async (_req: Request, res: Response) => {
      const data =
        await DashboardService.getRecentTransactions();

      return success(res, data);
    },
  );

  static getLowStock = asyncHandler(
    async (_req: Request, res: Response) => {
      const data =
        await DashboardService.getLowStock();

      return success(res, data);
    },
  );

  static getPeopleSummary = asyncHandler(
    async (_req: Request, res: Response) => {
      const data =
        await DashboardService.getPeopleSummary();

      return success(res, data);
    },
  );
}