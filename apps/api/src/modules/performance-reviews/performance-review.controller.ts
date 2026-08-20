import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { PerformanceReviewService } from "./performance-review.service.js";
import { Prisma } from "../../generated/prisma/client.js";

export class PerformanceReviewController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const review = await PerformanceReviewService.create(req.body);

    return created(
      res,
      review,
      "Performance review created successfully",
    );
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      employeeId,
      reviewer,
      scoreMin,
      scoreMax,
      search,
      sort,
      order,
    } = req.query;

    const reviews = await PerformanceReviewService.getAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      employeeId: employeeId as string | undefined,
      reviewer: reviewer as string | undefined,
      scoreMin: scoreMin
        ? Number(scoreMin)
        : undefined,

      scoreMax: scoreMax
        ? Number(scoreMax)
        : undefined,
      search: search as string | undefined,
      sort:
        (sort as keyof Prisma.PerformanceReviewOrderByWithRelationInput) ??
        "reviewDate",
      order: (order as Prisma.SortOrder) ?? "desc",
    });

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

  static getEmployeeHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const reviews =
        await PerformanceReviewService.getEmployeeHistory(
          req.params.employee_id.toString(),
          {
            page: req.query.page
              ? Number(req.query.page)
              : undefined,
            limit: req.query.limit
              ? Number(req.query.limit)
              : undefined,
            reviewer:
              req.query.reviewer?.toString(),
            scoreMin: req.query.scoreMin
              ? Number(req.query.scoreMin)
              : undefined,
            scoreMax: req.query.scoreMax
              ? Number(req.query.scoreMax)
              : undefined,
            sort:
              (req.query.sort as
                | keyof Prisma.PerformanceReviewOrderByWithRelationInput
                | undefined),
            order:
              (req.query.order as
                | Prisma.SortOrder
                | undefined),
          },
        );

      return success(res, reviews);
    },
  );
}