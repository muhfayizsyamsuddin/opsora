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
        sort: "startDate" | "endDate" | "createdAt" = "createdAt",
        order: "asc" | "desc" = "desc",
    ) {
        return prisma.leave.findMany({
            skip,
            take,
            where: {
            ...(status && { status }),
            ...(employeeId && { employeeId }),
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
    ) {
        return prisma.leave.count({
            where: {
            ...(status && { status }),
            ...(employeeId && { employeeId }),
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
      },
    });
  }

  static async update(
    id: string,
    data: {
      startDate?: Date;
      endDate?: Date;
      reason?: string;
      status?: LeaveStatus;
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

    static async approve(id: string) {
        return prisma.leave.update({
            where: {
            id,
            },
            data: {
            status: LeaveStatus.APPROVED,
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

    static async reject(id: string) {
        return prisma.leave.update({
            where: {
            id,
            },
            data: {
            status: LeaveStatus.REJECTED,
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
}