import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export class PayrollRepository {
  static async create(data: {
    employeeId: string;
    month: number;
    year: number;
    baseSalary: number;
    bonus: number;
    deduction: number;
    totalSalary: number;
  }) {
    return prisma.payroll.create({
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
    return prisma.payroll.findUnique({
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

  static async findByEmployeeAndPeriod(
    employeeId: string,
    month: number,
    year: number,
  ) {
    return prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
    });
  }

  static async findMany({
    page,
    perPage,
    employeeId,
    month,
    year,
    search,
    sort,
    order,
  }: {
    page: number;
    perPage: number;
    employeeId?: string;
    month?: number;
    year?: number;
    search?: string;
    sort: keyof Prisma.PayrollOrderByWithRelationInput;
    order: Prisma.SortOrder;
  }) {
    const skip =
      (page - 1) * perPage;

    const where: Prisma.PayrollWhereInput = {
      ...(employeeId && { employeeId }),
      ...(month && { month }),
      ...(year && { year }),
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
      prisma.payroll.findMany({
        where,
        skip,
        take: perPage,
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

      prisma.payroll.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(
          total / perPage,
        ),
      },
    };
  }

  static async delete(id: string) {
    return prisma.payroll.delete({
      where: {
        id,
      },
    });
  }
}