import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HealthService } from "./health.service.js";
import { success } from "../../utils/response.js";

export class HealthController {
  static getHealth = asyncHandler(async (_req: Request, res: Response) => {
    const result = HealthService.getHealth();

    return success(res, result);
  });
}