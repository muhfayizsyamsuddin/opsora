import { prisma } from "../../lib/prisma.js";

export class ReportRepository {
  static async getDashboardReport() {
    const [
      totalEmployees,
      totalDepartments,
      presentToday,
      lateToday,
      absentToday,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      payrollAggregate,
      employeesByDepartment,
    ] = await Promise.all([
      prisma.employee.count(),

      prisma.department.count(),

      prisma.attendance.count({
        where: {
          status: "PRESENT",
        },
      }),

      prisma.attendance.count({
        where: {
          status: "LATE",
        },
      }),

      prisma.attendance.count({
        where: {
          status: "ABSENT",
        },
      }),

      prisma.leave.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.leave.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.leave.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.employee.aggregate({
        _sum: {
          salary: true,
        },
        _avg: {
          salary: true,
        },
      }),

      prisma.department.findMany({
        include: {
          _count: {
            select: {
              employees: true,
            },
          },
        },
      }),
    ]);

    return {
      totalEmployees,
      totalDepartments,
      presentToday,
      lateToday,
      absentToday,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,

      totalSalary: payrollAggregate._sum.salary ?? 0,
      averageSalary: payrollAggregate._avg.salary ?? 0,

      employeesByDepartment: employeesByDepartment.map((department) => ({
        id: department.id,
        name: department.name,
        totalEmployees: department._count.employees,
      })),
    };
  }

  static async getAttendanceReport() {
    const [present, late, absent, leave, totalAttendances] =
        await Promise.all([
        prisma.attendance.count({
            where: {
            status: "PRESENT",
            },
        }),

        prisma.attendance.count({
            where: {
            status: "LATE",
            },
        }),

        prisma.attendance.count({
            where: {
            status: "ABSENT",
            },
        }),

        prisma.attendance.count({
            where: {
            status: "LEAVE",
            },
        }),

        prisma.attendance.count(),
        ]);

    return {
        totalAttendances,
        present,
        late,
        absent,
        leave,
    };
  }

    static async getLeaveReport() {
        const [
            totalLeaves,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
        ] = await Promise.all([
            prisma.leave.count(),

            prisma.leave.count({
            where: {
                status: "PENDING",
            },
            }),

            prisma.leave.count({
            where: {
                status: "APPROVED",
            },
            }),

            prisma.leave.count({
            where: {
                status: "REJECTED",
            },
            }),
        ]);

        return {
            totalLeaves,
            pendingLeaves,
            approvedLeaves,
            rejectedLeaves,
        };
    }

    static async getPayrollReport() {
        const [aggregate, highestPayroll, lowestPayroll, totalPayrollRecords] =
            await Promise.all([
            prisma.payroll.aggregate({
                _sum: {
                totalSalary: true,
                },
                _avg: {
                totalSalary: true,
                },
            }),

            prisma.payroll.findFirst({
                orderBy: {
                totalSalary: "desc",
                },
                include: {
                employee: true,
                },
            }),

            prisma.payroll.findFirst({
                orderBy: {
                totalSalary: "asc",
                },
                include: {
                employee: true,
                },
            }),

            prisma.payroll.count(),
            ]);

        return {
            totalPayroll: aggregate._sum.totalSalary ?? 0,
            averagePayroll: aggregate._avg.totalSalary ?? 0,
            totalPayrollRecords,

            highestPayroll: highestPayroll
            ? {
                employee: highestPayroll.employee.name,
                totalSalary: highestPayroll.totalSalary,
                }
            : null,

            lowestPayroll: lowestPayroll
            ? {
                employee: lowestPayroll.employee.name,
                totalSalary: lowestPayroll.totalSalary,
                }
            : null,
        };
    }

    static async getPerformanceReport() {
        const [aggregate, highestReview, lowestReview, totalReviews] =
            await Promise.all([
            prisma.performanceReview.aggregate({
                _avg: {
                score: true,
                },
            }),

            prisma.performanceReview.findFirst({
                orderBy: {
                score: "desc",
                },
                include: {
                employee: true,
                },
            }),

            prisma.performanceReview.findFirst({
                orderBy: {
                score: "asc",
                },
                include: {
                employee: true,
                },
            }),

            prisma.performanceReview.count(),
            ]);

        return {
            averageScore: aggregate._avg.score ?? 0,
            totalReviews,

            highestScore: highestReview
            ? {
                employee: highestReview.employee.name,
                score: highestReview.score,
                }
            : null,

            lowestScore: lowestReview
            ? {
                employee: lowestReview.employee.name,
                score: lowestReview.score,
                }
            : null,
        };
    }
}