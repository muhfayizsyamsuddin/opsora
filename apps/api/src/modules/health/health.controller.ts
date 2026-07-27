import { Request, Response } from "express";
import { HealthService } from "./health.service.js";

export class HealthController {
  static getHealth(_req: Request, res: Response) {
    const result = HealthService.getHealth();

    return res.status(200).json(result);
  }
}