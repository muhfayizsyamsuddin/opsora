export const reportSchemas = {
  ReportDashboard: {
    type: "object",
    required: [
      "totalEmployees",
      "totalDepartments",
      "presentToday",
      "lateToday",
      "absentToday",
      "pendingLeaves",
      "approvedLeaves",
      "rejectedLeaves",
      "totalSalary",
      "averageSalary",
      "employeesByDepartment",
      "attendanceWeekly",
      "recentActivities",
      "upcomingLeaves",
    ],
    properties: {
      totalEmployees: {
        type: "integer",
        example: 7,
      },
      totalDepartments: {
        type: "integer",
        example: 5,
      },
      presentToday: {
        type: "integer",
        example: 0,
      },
      lateToday: {
        type: "integer",
        example: 0,
      },
      absentToday: {
        type: "integer",
        example: 0,
      },
      pendingLeaves: {
        type: "integer",
        example: 2,
      },
      approvedLeaves: {
        type: "integer",
        example: 3,
      },
      rejectedLeaves: {
        type: "integer",
        example: 2,
      },
      totalSalary: {
        type: "number",
        example: 49500000,
      },
      averageSalary: {
        type: "number",
        example: 7071428.57,
      },
      employeesByDepartment: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ReportEmployeesByDepartment",
        },
      },
      attendanceWeekly: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ReportAttendanceWeekly",
        },
      },
      recentActivities: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ReportRecentActivity",
        },
      },
      upcomingLeaves: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ReportUpcomingLeave",
        },
      },
    },
  },

  ReportEmployeesByDepartment: {
    type: "object",
    required: [
      "id",
      "name",
      "totalEmployees",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
      },
      totalEmployees: {
        type: "integer",
      },
    },
  },

  ReportAttendanceWeekly: {
    type: "object",
    required: [
      "day",
      "date",
      "attendance",
    ],
    properties: {
      day: {
        type: "string",
        example: "Mon",
      },
      date: {
        type: "string",
        format: "date",
        example: "2026-08-17",
      },
      attendance: {
        type: "integer",
        example: 5,
      },
    },
  },

  ReportRecentActivity: {
    type: "object",
    required: [
      "id",
      "type",
      "title",
      "description",
      "createdAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      type: {
        type: "string",
        enum: [
          "EMPLOYEE",
          "ATTENDANCE",
          "LEAVE",
          "PAYROLL",
          "PERFORMANCE",
        ],
      },
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  ReportUpcomingLeave: {
    type: "object",
    required: [
      "id",
      "name",
      "type",
      "startDate",
      "endDate",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
      },
      type: {
        type: "string",
      },
      startDate: {
        type: "string",
        format: "date-time",
      },
      endDate: {
        type: "string",
        format: "date-time",
      },
    },
  },

  ReportSales: {
    type: "object",
    required: [
      "totalSales",
      "completedSales",
      "cancelledSales",
      "totalRevenue",
    ],
    properties: {
      totalSales: {
        type: "integer",
      },
      completedSales: {
        type: "integer",
      },
      cancelledSales: {
        type: "integer",
      },
      totalRevenue: {
        type: "string",
        example: "10000",
      },
    },
  },

  ReportPurchases: {
    type: "object",
    required: [
      "totalPurchases",
      "completedPurchases",
      "draftPurchases",
      "cancelledPurchases",
      "totalPurchaseAmount",
    ],
    properties: {
      totalPurchases: {
        type: "integer",
      },
      completedPurchases: {
        type: "integer",
      },
      draftPurchases: {
        type: "integer",
      },
      cancelledPurchases: {
        type: "integer",
      },
      totalPurchaseAmount: {
        type: "string",
        example: "339000",
      },
    },
  },

  ReportInventory: {
    type: "object",
    required: [
      "totalProducts",
      "totalActiveProducts",
      "totalStockQuantity",
      "lowStockCount",
      "totalStockIn",
      "totalStockOut",
    ],
    properties: {
      totalProducts: {
        type: "integer",
      },
      totalActiveProducts: {
        type: "integer",
      },
      totalStockQuantity: {
        type: "string",
        example: "12",
      },
      lowStockCount: {
        type: "integer",
      },
      totalStockIn: {
        type: "string",
        example: "20",
      },
      totalStockOut: {
        type: "string",
        example: "14",
      },
    },
  },

  ReportProfit: {
    type: "object",
    required: [
      "revenue",
      "purchaseCost",
      "profit",
    ],
    properties: {
      revenue: {
        type: "string",
        example: "10000",
      },
      purchaseCost: {
        type: "string",
        example: "339000",
      },
      profit: {
        type: "string",
        example: "-329000",
      },
    },
  },
};