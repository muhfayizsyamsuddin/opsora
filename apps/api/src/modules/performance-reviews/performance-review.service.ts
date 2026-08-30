import { AppError } from "../../errors/AppError.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import { PerformanceReviewRepository } from "./performance-review.repository.js";
import { Prisma } from "../../generated/prisma/client.js";
import { UserRepository } from "../users/user.repository.js";

export class PerformanceReviewService {
  static async create(data: {
    employeeId: string;
    reviewerId: string;
    reviewPeriod: string;
    score: number;
    comments?: string;
  }) {
    const employee =
      await EmployeeRepository.findById(
        data.employeeId,
      );

    if (!employee) {
      throw new AppError(
        "Employee not found",
        404,
      );
    }

    if (employee.status !== "ACTIVE") {
      throw new AppError(
        "Inactive employee cannot receive performance reviews",
        400,
      );
    }

    const reviewer =
      await UserRepository.findById(
        data.reviewerId,
      );

    if (!reviewer) {
      throw new AppError(
        "Reviewer not found",
        404,
      );
    }

    const existingReview =
      await PerformanceReviewRepository.findByEmployeeAndPeriod(
        data.employeeId,
        data.reviewPeriod,
      );

    if (existingReview) {
      throw new AppError(
        "Performance review already exists for this employee and review period",
        409,
      );
    }

    return PerformanceReviewRepository.create({
      employeeId: data.employeeId,
      reviewerId: data.reviewerId,
      reviewPeriod: data.reviewPeriod,
      score: data.score,
      comments: data.comments,
      reviewDate: new Date(),
    });
  }

  static async getAll(query: {
    page: number;
    limit: number;
    employeeId?: string;
    reviewerId?: string;
    reviewPeriod?: string;
    scoreMin?: number;
    scoreMax?: number;
    search?: string;
    sort: keyof Prisma.PerformanceReviewOrderByWithRelationInput;
    order: Prisma.SortOrder;
  }) {
    return PerformanceReviewRepository.findMany(query);
  }

  static async getById(id: string) {
    const review = await PerformanceReviewRepository.findById(id);

    if (!review) {
      throw new AppError("Performance review not found", 404);
    }

    return review;
  }

  static async update(
    id: string,
    data: {
      reviewerId?: string;
      reviewPeriod?: string;
      score?: number;
      comments?: string;
    },
  ) {
    const review =
      await PerformanceReviewRepository.findById(id);

    if (!review) {
      throw new AppError(
        "Performance review not found",
        404,
      );
    }

    if (data.reviewerId) {
      const reviewer =
        await UserRepository.findById(
          data.reviewerId,
        );

      if (!reviewer) {
        throw new AppError(
          "Reviewer not found",
          404,
        );
      }
    }

    if (data.reviewPeriod) {
      const existingReview =
        await PerformanceReviewRepository.findByEmployeeAndPeriod(
          review.employeeId,
          data.reviewPeriod,
        );

      if (
        existingReview &&
        existingReview.id !== id
      ) {
        throw new AppError(
          "Performance review already exists for this employee and review period",
          409,
        );
      }
    }

    return PerformanceReviewRepository.update(
      id,
      data,
    );
  }

  static async delete(id: string) {
    const review = await PerformanceReviewRepository.findById(id);

    if (!review) {
      throw new AppError("Performance review not found", 404);
    }

    await PerformanceReviewRepository.delete(id);
  }

  static async getEmployeeHistory(
    employeeId: string,
    query: {
    page?: number;
    limit?: number;
    reviewerId?: string;
    reviewPeriod?: string;
    scoreMin?: number;
    scoreMax?: number;
    sort?: keyof Prisma.PerformanceReviewOrderByWithRelationInput;
    order?: Prisma.SortOrder;
  },
  ) {
    const employee =
      await EmployeeRepository.findById(employeeId);

    if (!employee) {
      throw new AppError(
        "Employee not found",
        404,
      );
    }

    return PerformanceReviewRepository.findMany({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      employeeId,
      reviewerId: query.reviewerId,
      reviewPeriod: query.reviewPeriod,
      scoreMin: query.scoreMin,
      scoreMax: query.scoreMax,
      sort: query.sort ?? "reviewDate",
      order: query.order ?? "desc",
    });
  }
}