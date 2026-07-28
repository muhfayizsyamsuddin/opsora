import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HealthService } from "./health.service.js";

export class HealthController {
  static getHealth = asyncHandler(async (_req: Request, res: Response) => {
    const result = HealthService.getHealth();

    res.json(result);
  });
}