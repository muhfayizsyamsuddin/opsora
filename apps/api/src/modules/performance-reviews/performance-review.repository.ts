import { prisma } from "../../lib/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";

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

  static async findMany({
    page,
    limit,
    employeeId,
    reviewer,
    score,
    search,
    sort,
    order,
  }: {
    page: number;
    limit: number;
    employeeId?: string;
    reviewer?: string;
    score?: number;
    search?: string;
    sort: keyof Prisma.PerformanceReviewOrderByWithRelationInput;
    order: Prisma.SortOrder;
  }) {
    const skip = (page - 1) * limit;

    const where: Prisma.PerformanceReviewWhereInput = {
      ...(employeeId && { employeeId }),
      ...(reviewer && {
        reviewer: {
          contains: reviewer,
          mode: "insensitive",
        },
      }),
      ...(score && { score }),
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
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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