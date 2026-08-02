import { AppError } from "../../errors/AppError.js";
import { EmployeeRepository } from "../employees/employee.repository.js";
import { PerformanceReviewRepository } from "./performance-review.repository.js";

export class PerformanceReviewService {
  static async create(data: {
    employeeId: string;
    reviewer: string;
    score: number;
    comments?: string;
    reviewDate: Date;
  }) {
    const employee = await EmployeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    return PerformanceReviewRepository.create(data);
  }

  static async getAll() {
    return PerformanceReviewRepository.findMany();
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
      reviewer?: string;
      score?: number;
      comments?: string;
      reviewDate?: Date;
    },
  ) {
    const review = await PerformanceReviewRepository.findById(id);

    if (!review) {
      throw new AppError("Performance review not found", 404);
    }

    return PerformanceReviewRepository.update(id, data);
  }

  static async delete(id: string) {
    const review = await PerformanceReviewRepository.findById(id);

    if (!review) {
      throw new AppError("Performance review not found", 404);
    }

    await PerformanceReviewRepository.delete(id);
  }
}