import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

export class PerformanceReviewRepository {
  static async create(data: {
    employeeId: string;
    reviewerId: string;
    reviewPeriod: string;
    score: number;
    comments?: string;
    reviewDate: Date;
  }) {
    return prisma.performanceReview.create({
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        reviewPeriod: data.reviewPeriod,
        score: data.score,
        comments: data.comments,
        reviewDate: data.reviewDate,
      },
      include: {
        employee: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
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
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static async findMany({
    page,
    limit,
    employeeId,
    reviewerId,
    reviewPeriod,
    scoreMin,
    scoreMax,
    search,
    sort,
    order,
  }: {
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
    const skip = (page - 1) * limit;

    const where: Prisma.PerformanceReviewWhereInput = {
      ...(employeeId && { employeeId }),

      ...(reviewerId && {
        reviewerId,
      }),

      ...(reviewPeriod && {
        reviewPeriod,
      }),

      ...(scoreMin !== undefined || scoreMax !== undefined
        ? {
            score: {
              ...(scoreMin !== undefined && {
                gte: scoreMin,
              }),
              ...(scoreMax !== undefined && {
                lte: scoreMax,
              }),
            },
          }
        : {}),

      ...(search && {
        employee: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.performanceReview.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.performanceReview.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        per_page: limit,
        total,
        total_pages: Math.ceil(
          total / limit,
        ),
      }
    };
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
    return prisma.performanceReview.update({
      where: { id },
      data: {
        ...(data.reviewerId !== undefined && {
          reviewer: {
            connect: {
              id: data.reviewerId,
            },
          },
        }),

        ...(data.reviewPeriod !== undefined && {
          reviewPeriod: data.reviewPeriod,
        }),

        ...(data.score !== undefined && {
          score: data.score,
        }),

        ...(data.comments !== undefined && {
          comments: data.comments,
        }),
      },
      include: {
        employee: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
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