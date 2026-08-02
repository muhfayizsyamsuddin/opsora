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

  static async findMany() {
    return prisma.payroll.findMany({
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });
  }

  static async delete(id: string) {
    return prisma.payroll.delete({
      where: {
        id,
      },
    });
  }
}