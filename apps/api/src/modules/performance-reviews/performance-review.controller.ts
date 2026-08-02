import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { PerformanceReviewService } from "./performance-review.service.js";

export class PerformanceReviewController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const review = await PerformanceReviewService.create(req.body);

    return created(
      res,
      review,
      "Performance review created successfully",
    );
  });

  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const reviews = await PerformanceReviewService.getAll();

    return success(res, reviews);
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const review = await PerformanceReviewService.getById(
      req.params.id.toString(),
    );

    return success(res, review);
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const review = await PerformanceReviewService.update(
      req.params.id.toString(),
      req.body,
    );

    return success(
      res,
      review,
      "Performance review updated successfully",
    );
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await PerformanceReviewService.delete(req.params.id.toString());

    return noContent(res);
  });
}