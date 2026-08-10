import { prisma } from "../../lib/prisma.js";

type RecentActivity = {
  id: string;
  type:
    | "EMPLOYEE"
    | "ATTENDANCE"
    | "LEAVE"
    | "PAYROLL"
    | "PERFORMANCE";
  title: string;
  description: string;
  createdAt: Date;
};

export class ReportRepository {
  static async getDashboardReport() {
    const today = new Date();

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);
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
      weeklyAttendances,
      recentEmployees,
      recentAttendances,
      recentLeaves,
      recentPayrolls,
      recentPerformanceReviews,
      upcomingLeaves,
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
      prisma.attendance.findMany({
        where: {
          checkIn: {
            gte: startDate,
          },
        },
        select: {
          employeeId: true,
          checkIn: true,
        },
      }),
      prisma.employee.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.attendance.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          employee: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.leave.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          status: true,
          employee: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.payroll.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          employee: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.performanceReview.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          score: true,
          employee: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.leave.findMany({
        where: {
          status: "APPROVED",
          endDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          startDate: "asc",
        },
        take: 5,
        select: {
          id: true,
          startDate: true,
          endDate: true,
          reason: true,
          employee: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const attendanceWeekly = Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date(startDate);

        date.setDate(
          startDate.getDate() + index,
        );

        const dateKey = date
          .toISOString()
          .slice(0, 10);

        const employeeIds = new Set(
          weeklyAttendances
            .filter((attendance) => {
              return (
                attendance.checkIn
                  .toISOString()
                  .slice(0, 10) === dateKey
              );
            })
            .map(
              (attendance) =>
                attendance.employeeId,
            ),
        );

        return {
          day: date.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            },
          ),
          date: dateKey,
          attendance: employeeIds.size,
        };
      },
    );

    const recentActivities: RecentActivity[] = [
      ...recentEmployees.map((employee) => ({
        id: employee.id,
        type: "EMPLOYEE" as const,
        title: "New employee added",
        description: `${employee.name} joined ${employee.department.name}`,
        createdAt: employee.createdAt,
      })),

      ...recentAttendances.map((attendance) => ({
        id: attendance.id,
        type: "ATTENDANCE" as const,
        title: "Attendance checked in",
        description: `${attendance.employee.name} checked in`,
        createdAt: attendance.createdAt,
      })),

      ...recentLeaves.map((leave) => ({
        id: leave.id,
        type: "LEAVE" as const,
        title: "Leave request submitted",
        description: `${leave.employee.name} requested leave`,
        createdAt: leave.createdAt,
      })),

      ...recentPayrolls.map((payroll) => ({
        id: payroll.id,
        type: "PAYROLL" as const,
        title: "Payroll created",
        description: `Payroll created for ${payroll.employee.name}`,
        createdAt: payroll.createdAt,
      })),

      ...recentPerformanceReviews.map((review) => ({
        id: review.id,
        type: "PERFORMANCE" as const,
        title: "Performance review created",
        description: `${review.employee.name} received a score of ${review.score}`,
        createdAt: review.createdAt,
      })),
    ]
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime(),
      )
      .slice(0, 5);

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
      attendanceWeekly,
      recentActivities,
      upcomingLeaves: upcomingLeaves.map((leave) => ({
        id: leave.id,
        name: leave.employee.name,
        type: leave.reason,
        startDate: leave.startDate,
        endDate: leave.endDate,
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