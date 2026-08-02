import { prisma } from "../../lib/prisma.js";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

export class AttendanceRepository {
  static async create(data: {
    employeeId: string;
    checkIn: Date;
    checkOut?: Date;
    status?: AttendanceStatus;
  }) {
    return prisma.attendance.create({
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
    return prisma.attendance.findUnique({
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
      checkOut?: Date;
      status?: AttendanceStatus;
    },
  ) {
    return prisma.attendance.update({
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
    return prisma.attendance.delete({
      where: {
        id,
      },
    });
  }

  static async findMany(
        skip: number,
        take: number,
        search?: string,
        employeeId?: string,
        status?: AttendanceStatus,
        sort: "checkIn" | "createdAt" = "createdAt",
        order: "asc" | "desc" = "desc",
    ) {
        return prisma.attendance.findMany({
            skip,
            take,
            where: {
            ...(employeeId && {
                employeeId,
            }),

            ...(status && {
                status,
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
            },

            orderBy: {
            [sort]: order,
            },
        });
    }

    static async count(
        search?: string,
        employeeId?: string,
        status?: AttendanceStatus,
    ) {
        return prisma.attendance.count({
            where: {
            ...(employeeId && {
                employeeId,
            }),

            ...(status && {
                status,
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
}