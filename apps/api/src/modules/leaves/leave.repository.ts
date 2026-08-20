import { LeaveStatus } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

export class LeaveRepository {
  static async create(data: {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status?: LeaveStatus;
  }) {
    return prisma.leave.create({
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

  static async findMany(
    skip: number,
    take: number,
    search?: string,
    status?: LeaveStatus,
    employeeId?: string,
    startDate?: Date,
    endDate?: Date,
    sort: "startDate" | "endDate" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    return prisma.leave.findMany({
      skip,
      take,
      where: {
        ...(status && { status }),
        ...(employeeId && { employeeId }),

        ...(startDate && {
          startDate: {
            gte: startDate,
          },
        }),

        ...(endDate && {
          endDate: {
            lte: endDate,
          },
        }),

        ...(search && {
          employee: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
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

      orderBy: {
        [sort]: order,
      },
    });
  }

  static async count(
    search?: string,
    status?: LeaveStatus,
    employeeId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return prisma.leave.count({
      where: {
        ...(status && { status }),
        ...(employeeId && { employeeId }),

        ...(startDate && {
          startDate: {
            gte: startDate,
          },
        }),

        ...(endDate && {
          endDate: {
            lte: endDate,
          },
        }),

        ...(search && {
          employee: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      },
    });
  }

  static async findById(id: string) {
    return prisma.leave.findUnique({
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

  static async update(
    id: string,
    data: {
      startDate?: Date;
      endDate?: Date;
      reason?: string;
    },
  ) {
    return prisma.leave.update({
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
    return prisma.leave.delete({
      where: {
        id,
      },
    });
  }

  static async approve(
    id: string,
    reviewerId: string,
  ) {
    return prisma.leave.update({
      where: {
        id,
      },
      data: {
        status: LeaveStatus.APPROVED,
        reviewerId,
        reviewedAt: new Date(),
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

  static async reject(
    id: string,
    reviewerId: string,
  ) {
    return prisma.leave.update({
      where: {
        id,
      },
      data: {
        status: LeaveStatus.REJECTED,
        reviewerId,
        reviewedAt: new Date(),
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

    static async findOverlappingLeave(
        employeeId: string,
        startDate: Date,
        endDate: Date,
    ) {
        return prisma.leave.findFirst({
            where: {
            employeeId,
            status: {
                in: [
                LeaveStatus.PENDING,
                LeaveStatus.APPROVED,
                ],
            },
            startDate: {
                lte: endDate,
            },
            endDate: {
                gte: startDate,
            },
            },
        });
    }

    static async findOverlappingLeaveForUpdate(
      id: string,
      employeeId: string,
      startDate: Date,
      endDate: Date,
    ) {
      return prisma.leave.findFirst({
        where: {
          id: {
            not: id,
          },

          employeeId,

          status: {
            in: [
              LeaveStatus.PENDING,
              LeaveStatus.APPROVED,
            ],
          },

          startDate: {
            lte: endDate,
          },

          endDate: {
            gte: startDate,
          },
        },
      });
    }

  static async cancel(id: string) {
    return prisma.leave.update({
      where: {
        id,
      },
      data: {
        status: LeaveStatus.CANCELLED,
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
}