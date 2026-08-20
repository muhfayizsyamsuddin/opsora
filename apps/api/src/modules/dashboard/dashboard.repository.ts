import {
  AttendanceStatus,
  LeaveStatus,
  PurchaseStatus,
  SaleStatus,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export class DashboardRepository {
  static async getStatistics() {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      // People Operations
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

      // Sales
      totalSalesCount,
      totalSalesAmount,
      salesTodayCount,
      salesTodayAmount,
      completedSales,
      cancelledSales,

      // Purchases
      totalPurchasesCount,
      totalPurchasesAmount,
      purchasesTodayCount,
      purchasesTodayAmount,
      completedPurchases,
      draftPurchases,
      cancelledPurchases,

      // Products / Inventory
      totalProducts,
      totalActiveProducts,
      totalStockQuantity,
      activeProducts,

      // Recent inventory activity
      recentInventoryMovements,
    ] = await Promise.all([
      // =========================
      // PEOPLE OPERATIONS
      // =========================

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

      // =========================
      // SALES
      // =========================

      prisma.sale.count(),

      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: SaleStatus.COMPLETED,
        },
      }),

      prisma.sale.count({
        where: {
          status: SaleStatus.COMPLETED,
          saleDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: SaleStatus.COMPLETED,
          saleDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.sale.count({
        where: {
          status: SaleStatus.COMPLETED,
        },
      }),

      prisma.sale.count({
        where: {
          status: SaleStatus.CANCELLED,
        },
      }),

      // =========================
      // PURCHASES
      // =========================

      prisma.purchase.count(),

      prisma.purchase.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: PurchaseStatus.COMPLETED,
        },
      }),

      prisma.purchase.count({
        where: {
          status: PurchaseStatus.COMPLETED,
          purchaseDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.purchase.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: PurchaseStatus.COMPLETED,
          purchaseDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      prisma.purchase.count({
        where: {
          status: PurchaseStatus.COMPLETED,
        },
      }),

      prisma.purchase.count({
        where: {
          status: PurchaseStatus.DRAFT,
        },
      }),

      prisma.purchase.count({
        where: {
          status: PurchaseStatus.CANCELLED,
        },
      }),

      // =========================
      // PRODUCTS / INVENTORY
      // =========================

      prisma.product.count(),

      prisma.product.count({
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
      }),

      prisma.product.aggregate({
        _sum: {
          stock: true,
        },
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
      }),

      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          minimumStock: true,
        },
      }),

      // =========================
      // RECENT INVENTORY
      // =========================

      prisma.inventoryMovement.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      }),
    ]);

    const lowStockProducts = activeProducts.filter(
      (product) =>
        product.stock.lte(product.minimumStock),
    );

    return {
      // =========================
      // PEOPLE
      // =========================

      people: {
        totalEmployees,
        totalDepartments,
        presentToday,
        lateToday,
        absentToday,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,

        totalSalary:
          salaryStatistics._sum.salary ?? 0,

        averageSalary: Math.round(
          (salaryStatistics._avg.salary ?? 0) * 100,
        ) / 100,

        employeesByDepartment:
          employeesByDepartment.map((department) => ({
            id: department.id,
            name: department.name,
            totalEmployees:
              department._count.employees,
          })),
      },

      // =========================
      // SALES
      // =========================

      sales: {
        totalSalesCount,
        totalSalesAmount:
          totalSalesAmount._sum.totalAmount ?? 0,

        salesTodayCount,
        salesTodayAmount:
          salesTodayAmount._sum.totalAmount ?? 0,

        completedSales,
        cancelledSales,
      },

      // =========================
      // PURCHASES
      // =========================

      purchases: {
        totalPurchasesCount,
        totalPurchasesAmount:
          totalPurchasesAmount._sum.totalAmount ?? 0,

        purchasesTodayCount,
        purchasesTodayAmount:
          purchasesTodayAmount._sum.totalAmount ?? 0,

        completedPurchases,
        draftPurchases,
        cancelledPurchases,
      },

      // =========================
      // INVENTORY
      // =========================

      inventory: {
        totalProducts,
        totalActiveProducts,

        totalStockQuantity:
          totalStockQuantity._sum.stock ?? 0,

        lowStockCount:
          lowStockProducts.length,

        lowStockProducts,

        recentInventoryMovements,
      },
    };
  }

  static async getSummary() {
    const [
      totalSalesCount,
      totalSalesAmount,
      totalPurchasesCount,
      totalPurchasesAmount,
      totalProducts,
      totalActiveProducts,
      totalStockQuantity,
    ] = await Promise.all([
      prisma.sale.count({
        where: {
          status: SaleStatus.COMPLETED,
        },
      }),

      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: SaleStatus.COMPLETED,
        },
      }),

      prisma.purchase.count({
        where: {
          status: PurchaseStatus.COMPLETED,
        },
      }),

      prisma.purchase.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: PurchaseStatus.COMPLETED,
        },
      }),

      prisma.product.count(),

      prisma.product.count({
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
      }),

      prisma.product.aggregate({
        _sum: {
          stock: true,
        },
        where: {
          status: "ACTIVE",
          deletedAt: null,
        },
      }),
    ]);

    return {
      sales: {
        totalCount: totalSalesCount,
        totalAmount:
          totalSalesAmount._sum.totalAmount ?? 0,
      },

      purchases: {
        totalCount: totalPurchasesCount,
        totalAmount:
          totalPurchasesAmount._sum.totalAmount ?? 0,
      },

      inventory: {
        totalProducts,
        totalActiveProducts,
        totalStockQuantity:
          totalStockQuantity._sum.stock ?? 0,
      },
    };
  }

  static async getRecentTransactions() {
    const [sales, purchases] = await Promise.all([
      prisma.sale.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          status: {
            not: SaleStatus.CANCELLED,
          },
        },
        select: {
          id: true,
          saleDate: true,
          totalAmount: true,
          status: true,
          paymentMethod: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.purchase.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          status: {
            not: PurchaseStatus.CANCELLED,
          },
        },
        select: {
          id: true,
          purchaseDate: true,
          totalAmount: true,
          status: true,
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const transactions = [
      ...sales.map((sale) => ({
        id: sale.id,
        type: "SALE" as const,
        date: sale.saleDate,
        amount: sale.totalAmount,
        status: sale.status,
        party: sale.customer,
      })),

      ...purchases.map((purchase) => ({
        id: purchase.id,
        type: "PURCHASE" as const,
        date: purchase.purchaseDate,
        amount: purchase.totalAmount,
        status: purchase.status,
        party: purchase.supplier,
      })),
    ];

    transactions.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );

    return transactions.slice(0, 10);
  }

  static async getLowStock() {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minimumStock: true,
      },
      orderBy: {
        stock: "asc",
      },
    });

    return products.filter((product) =>
      product.stock.lte(product.minimumStock),
    );
  }

  static async getPeopleSummary() {
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
      employeesByDepartment:
        employeesByDepartment.map((department) => ({
          id: department.id,
          name: department.name,
          totalEmployees:
            department._count.employees,
        })),
    };
  }
}