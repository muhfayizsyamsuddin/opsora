export const dashboardSchemas = {
  DashboardInventoryMovementProduct: {
    type: "object",
    required: ["id", "name", "sku"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Air Mineral",
      },
      sku: {
        type: "string",
        example: "AM-001",
      },
    },
  },

  DashboardInventoryMovement: {
    type: "object",
    required: [
      "id",
      "productId",
      "userId",
      "movementType",
      "referenceType",
      "referenceId",
      "quantity",
      "beforeStock",
      "afterStock",
      "reason",
      "createdAt",
      "product",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      productId: {
        type: "string",
        format: "uuid",
      },
      userId: {
        type: "string",
        format: "uuid",
      },
      movementType: {
        type: "string",
        enum: ["IN", "OUT"],
      },
      referenceType: {
        type: "string",
        enum: [
          "PURCHASE",
          "SALE",
          "ADJUSTMENT",
        ],
      },
      referenceId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
      quantity: {
        type: "string",
        example: "2",
      },
      beforeStock: {
        type: "string",
        example: "10",
      },
      afterStock: {
        type: "string",
        example: "12",
      },
      reason: {
        type: "string",
        nullable: true,
        example: "Physical stock correction",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      product: {
        $ref: "#/components/schemas/DashboardInventoryMovementProduct",
      },
    },
  },

  DashboardLowStockProduct: {
    type: "object",
    required: [
      "id",
      "name",
      "sku",
      "stock",
      "minimumStock",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Air Mineral",
      },
      sku: {
        type: "string",
        example: "AM-001",
      },
      stock: {
        type: "string",
        example: "5",
      },
      minimumStock: {
        type: "string",
        example: "10",
      },
    },
  },

  DashboardEmployeesByDepartment: {
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
        example: "IT",
      },
      totalEmployees: {
        type: "integer",
        example: 4,
      },
    },
  },

  DashboardStatistics: {
    type: "object",
    required: [
      "people",
      "sales",
      "purchases",
      "inventory",
    ],
    properties: {
      people: {
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
              $ref: "#/components/schemas/DashboardEmployeesByDepartment",
            },
          },
        },
      },

      sales: {
        type: "object",
        required: [
          "totalSalesCount",
          "totalSalesAmount",
          "salesTodayCount",
          "salesTodayAmount",
          "completedSales",
          "cancelledSales",
        ],
        properties: {
          totalSalesCount: {
            type: "integer",
            example: 10,
          },
          totalSalesAmount: {
            type: "string",
            example: "10000",
          },
          salesTodayCount: {
            type: "integer",
            example: 0,
          },
          salesTodayAmount: {
            type: "string",
            example: "0",
          },
          completedSales: {
            type: "integer",
            example: 2,
          },
          cancelledSales: {
            type: "integer",
            example: 5,
          },
        },
      },

      purchases: {
        type: "object",
        required: [
          "totalPurchasesCount",
          "totalPurchasesAmount",
          "purchasesTodayCount",
          "purchasesTodayAmount",
          "completedPurchases",
          "draftPurchases",
          "cancelledPurchases",
        ],
        properties: {
          totalPurchasesCount: {
            type: "integer",
            example: 6,
          },
          totalPurchasesAmount: {
            type: "string",
            example: "339000",
          },
          purchasesTodayCount: {
            type: "integer",
            example: 1,
          },
          purchasesTodayAmount: {
            type: "string",
            example: "9000",
          },
          completedPurchases: {
            type: "integer",
            example: 4,
          },
          draftPurchases: {
            type: "integer",
            example: 0,
          },
          cancelledPurchases: {
            type: "integer",
            example: 2,
          },
        },
      },

      inventory: {
        type: "object",
        required: [
          "totalProducts",
          "totalActiveProducts",
          "totalStockQuantity",
          "lowStockCount",
          "lowStockProducts",
          "recentInventoryMovements",
        ],
        properties: {
          totalProducts: {
            type: "integer",
            example: 1,
          },
          totalActiveProducts: {
            type: "integer",
            example: 1,
          },
          totalStockQuantity: {
            type: "string",
            example: "12",
          },
          lowStockCount: {
            type: "integer",
            example: 0,
          },
          lowStockProducts: {
            type: "array",
            items: {
              $ref: "#/components/schemas/DashboardLowStockProduct",
            },
          },
          recentInventoryMovements: {
            type: "array",
            items: {
              $ref: "#/components/schemas/DashboardInventoryMovement",
            },
          },
        },
      },
    },
  },

  DashboardSummary: {
    type: "object",
    required: [
      "sales",
      "purchases",
      "inventory",
    ],
    properties: {
      sales: {
        type: "object",
        required: [
          "totalCount",
          "totalAmount",
        ],
        properties: {
          totalCount: {
            type: "integer",
            example: 2,
          },
          totalAmount: {
            type: "string",
            example: "10000",
          },
        },
      },

      purchases: {
        type: "object",
        required: [
          "totalCount",
          "totalAmount",
        ],
        properties: {
          totalCount: {
            type: "integer",
            example: 4,
          },
          totalAmount: {
            type: "string",
            example: "339000",
          },
        },
      },

      inventory: {
        type: "object",
        required: [
          "totalProducts",
          "totalActiveProducts",
          "totalStockQuantity",
        ],
        properties: {
          totalProducts: {
            type: "integer",
            example: 1,
          },
          totalActiveProducts: {
            type: "integer",
            example: 1,
          },
          totalStockQuantity: {
            type: "string",
            example: "12",
          },
        },
      },
    },
  },

  DashboardRecentTransaction: {
    type: "object",
    required: [
      "id",
      "type",
      "date",
      "amount",
      "status",
      "party",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      type: {
        type: "string",
        enum: ["SALE", "PURCHASE"],
      },
      date: {
        type: "string",
        format: "date-time",
      },
      amount: {
        type: "string",
        example: "5000",
      },
      status: {
        type: "string",
      },
      party: {
        type: "object",
        nullable: true,
        required: ["id", "name"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
        },
      },
    },
  },

  DashboardPeopleSummary: {
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
      "employeesByDepartment",
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
      employeesByDepartment: {
        type: "array",
        items: {
          $ref: "#/components/schemas/DashboardEmployeesByDepartment",
        },
      },
    },
  },
};