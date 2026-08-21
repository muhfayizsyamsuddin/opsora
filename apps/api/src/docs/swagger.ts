import swaggerJsdoc from "swagger-jsdoc";

import { authSchemas } from "./schemas/auth.schema.js";
import { commonSchemas } from "./schemas/common.schema.js";
import { departmentSchemas } from "./schemas/department.schema.js";
import { employeeSchemas } from "./schemas/employee.schema.js";
import { attendanceSchemas } from "./schemas/attendance.schema.js";
import { leaveSchemas } from "./schemas/leave.schema.js";
import { payrollSchemas } from "./schemas/payroll.schema.js";
import { performanceReviewSchemas } from "./schemas/performance-review.schema.js";
import { dashboardSchemas } from "./schemas/dashboard.schema.js";
import { reportSchemas } from "./schemas/report.schema.js";
import { userSchemas } from "./schemas/user.schema.js";
import { roleSchemas } from "./schemas/role.schema.js";
import { permissionSchemas } from "./schemas/permission.schema.js";
import { categorySchemas } from "./schemas/category.schema.js";
import { productSchemas } from "./schemas/product.schema.js";
import { supplierSchemas } from "./schemas/supplier.schema.js";
import { customerSchemas } from "./schemas/customer.schema.js";
import { purchaseSchemas } from "./schemas/purchase.schema.js";
import { saleSchemas } from "./schemas/sale.schema.js";
import { inventorySchemas } from "./schemas/inventory.schema.js";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Opsora API",
      version: "1.0.0",
      description:
        "REST API for the Opsora system covering Core Business Operations, People Operations, and System Administration.",
    },

    servers: [
      {
        url: "http://localhost:3001/api/v1",
        description: "Development Server",
      },
      {
        url: "https://api-opsora.faizms.com/api/v1",
        description: "Production Server",
      },
    ],

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management",
      },
      {
        name: "Roles",
        description: "Role management",
      },
      {
        name: "Permissions",
        description: "Permission management",
      },
      {
        name: "Categories",
        description: "Category management",
      },
      {
        name: "Products",
        description: "Product management",
      },
      {
        name: "Suppliers",
        description: "Supplier management",
      },
      {
        name: "Customers",
        description: "Customer management",
      },
      {
        name: "Purchases",
        description: "Purchase management",
      },
      {
        name: "Sales",
        description: "Sales management",
      },
      {
        name: "Inventory",
        description: "Inventory management",
      },
      {
        name: "Reports",
        description: "Reporting endpoints",
      },
      {
        name: "Departments",
        description: "Department management",
      },
      {
        name: "Employees",
        description: "Employee management",
      },
      {
        name: "Attendance",
        description: "Attendance management",
      },
      {
        name: "Leave",
        description: "Leave management",
      },
      {
        name: "Payroll",
        description: "Payroll management",
      },
      {
        name: "Performance Review",
        description: "Performance review management",
      },
      {
        name: "Dashboard",
        description: "Dashboard statistics",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      responses: {
        Unauthorized: {
          description: "Authentication required.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        Forbidden: {
          description:
            "You don't have permission to access this resource.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        BadRequest: {
          description: "Validation failed.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        NotFound: {
          description: "Resource not found.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },

        InternalServerError: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },

      schemas: {
        PaginationMeta: {
          type: "object",
          required: [
            "page",
            "per_page",
            "total",
            "total_pages",
          ],
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            per_page: {
              type: "integer",
              example: 20,
            },
            total: {
              type: "integer",
              example: 100,
            },
            total_pages: {
              type: "integer",
              example: 5,
            },
          },
        },

        ...commonSchemas,
        ...authSchemas,
        ...departmentSchemas,
        ...employeeSchemas,
        ...attendanceSchemas,
        ...leaveSchemas,
        ...payrollSchemas,
        ...performanceReviewSchemas,
        ...dashboardSchemas,
        ...reportSchemas,
        ...userSchemas,
        ...roleSchemas,
        ...permissionSchemas,
        ...categorySchemas,
        ...productSchemas,
        ...supplierSchemas,
        ...customerSchemas,
        ...purchaseSchemas,
        ...saleSchemas,
        ...inventorySchemas,
      },
    },
  },

  apis: ["src/docs/paths/*.ts"],
});