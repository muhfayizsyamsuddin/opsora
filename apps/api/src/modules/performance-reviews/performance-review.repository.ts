import { prisma } from "../../lib/prisma.js";

export class PerformanceReviewRepository {
  static async create(data: {
    employeeId: string;
    reviewer: string;
    score: number;
    comments?: string;
    reviewDate: Date;
  }) {
    return prisma.performanceReview.create({
      data,
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.performanceReview.findUnique({
      where: {
        id,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  static async findMany() {
    return prisma.performanceReview.findMany({
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
      orderBy: {
        reviewDate: "desc",
      },
    });
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
    return prisma.performanceReview.update({
      where: {
        id,
      },
      data,
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return prisma.performanceReview.delete({
      where: {
        id,
      },
    });
  }
}