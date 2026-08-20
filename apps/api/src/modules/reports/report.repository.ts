import { Prisma } from "../../generated/prisma/browser.js";
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
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

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
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "PRESENT",
        },
      }),

      prisma.attendance.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "LATE",
        },
      }),

      prisma.attendance.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
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

  static async getSalesReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            saleDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {};

    const [
      totalSales,
      completedSales,
      cancelledSales,
      revenueAggregate,
    ] = await Promise.all([
      prisma.sale.count({
        where: dateFilter,
      }),

      prisma.sale.count({
        where: {
          ...dateFilter,
          status: "COMPLETED",
        },
      }),

      prisma.sale.count({
        where: {
          ...dateFilter,
          status: "CANCELLED",
        },
      }),

      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          ...dateFilter,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      totalSales,
      completedSales,
      cancelledSales,
      totalRevenue:
        revenueAggregate._sum.totalAmount ?? 0,
    };
  }

  static async getPurchasesReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const dateFilter =
      dateFrom || dateTo
        ? {
            purchaseDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {};

    const [
      totalPurchases,
      completedPurchases,
      draftPurchases,
      cancelledPurchases,
      amountAggregate,
    ] = await Promise.all([
      prisma.purchase.count({
        where: dateFilter,
      }),

      prisma.purchase.count({
        where: {
          ...dateFilter,
          status: "COMPLETED",
        },
      }),

      prisma.purchase.count({
        where: {
          ...dateFilter,
          status: "DRAFT",
        },
      }),

      prisma.purchase.count({
        where: {
          ...dateFilter,
          status: "CANCELLED",
        },
      }),

      prisma.purchase.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          ...dateFilter,
          status: "COMPLETED",
        },
      }),
    ]);

    return {
      totalPurchases,
      completedPurchases,
      draftPurchases,
      cancelledPurchases,
      totalPurchaseAmount:
        amountAggregate._sum.totalAmount ?? 0,
    };
  }

  static async getInventoryReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const productFilter = {
      status: "ACTIVE" as const,
      deletedAt: null,
    };

    const movementDateFilter =
      dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {};

    const [
      totalProducts,
      totalActiveProducts,
      totalStock,
      lowStockProducts,
      stockIn,
      stockOut,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.product.count({
        where: productFilter,
      }),

      prisma.product.aggregate({
        _sum: {
          stock: true,
        },
        where: productFilter,
      }),

      prisma.product.findMany({
        where: productFilter,
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          minimumStock: true,
        },
      }),

      prisma.inventoryMovement.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          ...movementDateFilter,
          movementType: "IN",
        },
      }),

      prisma.inventoryMovement.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          ...movementDateFilter,
          movementType: "OUT",
        },
      }),
    ]);

    return {
      totalProducts,
      totalActiveProducts,
      totalStockQuantity:
        totalStock._sum.stock ?? 0,

      lowStockCount: lowStockProducts.filter(
        (product) =>
          product.stock.lte(
            product.minimumStock,
          ),
      ).length,

      totalStockIn:
        stockIn._sum.quantity ?? 0,

      totalStockOut:
        stockOut._sum.quantity ?? 0,
    };
  }

  static async getProfitReport(
    dateFrom?: Date,
    dateTo?: Date,
  ) {
    const saleDateFilter =
      dateFrom || dateTo
        ? {
            saleDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {};

    const purchaseDateFilter =
      dateFrom || dateTo
        ? {
            purchaseDate: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {};

    const [salesAggregate, purchasesAggregate] =
      await Promise.all([
        prisma.sale.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            ...saleDateFilter,
            status: "COMPLETED",
          },
        }),

        prisma.purchase.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            ...purchaseDateFilter,
            status: "COMPLETED",
          },
        }),
      ]);

    const revenue =
      salesAggregate._sum.totalAmount ??
      new Prisma.Decimal(0);

    const purchaseCost =
      purchasesAggregate._sum.totalAmount ??
      new Prisma.Decimal(0);

    return {
      revenue,
      purchaseCost,
      profit: revenue.sub(purchaseCost),
    };
  }
}