import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, noContent, success } from "../../utils/response.js";
import { PerformanceReviewService } from "./performance-review.service.js";
import { Prisma } from "../../generated/prisma/client.js";

export class PerformanceReviewController {
  static create = asyncHandler(
    async (req: Request, res: Response) => {
      const review =
        await PerformanceReviewService.create({
          employeeId: req.body.employee_id,
          reviewerId: req.body.reviewer_id,
          reviewPeriod: req.body.review_period,
          score: req.body.score,
          comments: req.body.comments,
        });

      return created(
        res,
        review,
        "Performance review created successfully",
      );
    },
  );

  static getAll = asyncHandler(
    async (req: Request, res: Response) => {
      const reviews =
        await PerformanceReviewService.getAll({
          page: Number(req.query.page ?? 1),

          limit: Number(
            req.query.per_page ?? 20,
          ),

          employeeId:
            req.query.employee_id?.toString(),

          reviewerId:
            req.query.reviewer_id?.toString(),

          scoreMin: req.query.score_min
            ? Number(req.query.score_min)
            : undefined,

          scoreMax: req.query.score_max
            ? Number(req.query.score_max)
            : undefined,

          search:
            req.query.search?.toString(),

          sort:
            (req.query.sort_by as
              | keyof Prisma.PerformanceReviewOrderByWithRelationInput
              | undefined) ??
            "reviewDate",

          order:
            (req.query.sort_order as
              | Prisma.SortOrder
              | undefined) ??
            "desc",
        });

      return success(res, reviews);
    },
  );

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const review = await PerformanceReviewService.getById(
      req.params.id.toString(),
    );

    return success(res, review);
  });

  static update = asyncHandler(
    async (req: Request, res: Response) => {
      const review =
        await PerformanceReviewService.update(
          req.params.id.toString(),
          {
            reviewerId:
              req.body.reviewer_id,

            reviewPeriod:
              req.body.review_period,

            score: req.body.score,

            comments:
              req.body.comments,
          },
        );

      return success(
        res,
        review,
        "Performance review updated successfully",
      );
    },
  );

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
            page: Number(
              req.query.page ?? 1,
            ),

            limit: Number(
              req.query.per_page ?? 20,
            ),

            reviewerId:
              req.query.reviewer_id?.toString(),

            reviewPeriod:
              req.query.review_period?.toString(),

            scoreMin: req.query.score_min
              ? Number(req.query.score_min)
              : undefined,

            scoreMax: req.query.score_max
              ? Number(req.query.score_max)
              : undefined,

            sort:
              (req.query.sort_by as
                | keyof Prisma.PerformanceReviewOrderByWithRelationInput
                | undefined),

            order:
              (req.query.sort_order as
                | Prisma.SortOrder
                | undefined),
          },
        );

      return success(res, reviews);
    },
  );
}