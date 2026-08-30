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
    date?: Date,
    sort: "checkIn" | "createdAt" = "createdAt",
    order: "asc" | "desc" = "desc",
  ) {
    const dateFilter = date
      ? {
          checkIn: {
            gte: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            ),
            lt: new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1,
            ),
          },
        }
      : {};

    return prisma.attendance.findMany({
      skip,
      take,
      where: {
        ...dateFilter,

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
        date?: Date,
    ) {
        const dateFilter = date
          ? {
              checkIn: {
                gte: new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                ),
                lt: new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1,
                ),
              },
            }
          : {};
        return prisma.attendance.count({
            where: {
              ...dateFilter,
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

  static async findByEmployeeAndDate(
    employeeId: string,
    date: Date,
  ) {
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    );

    return prisma.attendance.findFirst({
      where: {
        employeeId,
        checkIn: {
          gte: start,
          lt: end,
        },
      },
    });
  }
}