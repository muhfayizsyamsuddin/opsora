import { AttendanceStatus, LeaveStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export class DashboardRepository {
  static async getStatistics() {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalEmployees,
      totalDepartments,
      presentToday,
      lateToday,
      absentToday,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      employeesByDepartment,
      salaryStatistics,
    ] = await Promise.all([
      prisma.employee.count(),

      prisma.department.count(),

      prisma.attendance.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: AttendanceStatus.PRESENT,
        },
      }),

      prisma.attendance.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: AttendanceStatus.LATE,
        },
      }),

      prisma.attendance.count({
        where: {
          checkIn: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: AttendanceStatus.ABSENT,
        },
      }),

      prisma.leave.count({
        where: {
          status: LeaveStatus.PENDING,
        },
      }),

      prisma.leave.count({
        where: {
          status: LeaveStatus.APPROVED,
        },
      }),

      prisma.leave.count({
        where: {
          status: LeaveStatus.REJECTED,
        },
      }),
      prisma.department.findMany({
            select: {
            id: true,
            name: true,
            _count: {
                select: {
                employees: true,
                },
            },
            },
            orderBy: {
            name: "asc",
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
        totalSalary: salaryStatistics._sum.salary ?? 0,
        averageSalary: Math.round((salaryStatistics._avg.salary ?? 0) * 100) / 100,
        employeesByDepartment: employeesByDepartment.map((department) => ({
            id: department.id,
            name: department.name,
            totalEmployees: department._count.employees,
        })),
    };
  }
}