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

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Opsora API",
      version: "1.0.0",
      description: "HR Management System API",

      contact: {
        name: "Faiz Ms",
      },

      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:3001",
        description: "Development Server",
      },
      {
        url: "https://api-opsora.faizms.com",
        description: "Production Server",
      },
    ],

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: [
      { name: "Authentication", description: "Authentication endpoints" },
      { name: "Departments", description: "Department management" },
      { name: "Employees", description: "Employee management" },
      { name: "Attendance", description: "Attendance management" },
      { name: "Leave", description: "Leave management" },
      { name: "Payroll", description: "Payroll management" },
      { name: "Performance Review", description: "Performance review management" },
      { name: "Dashboard", description: "Dashboard statistics" },
      { name: "Reports", description: "Reporting endpoints" },
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
        },
        Forbidden: {
          description: "You don't have permission to access this resource.",
        },
        BadRequest: {
          description: "Validation failed.",
        },
        NotFound: {
          description: "Resource not found.",
        },
        InternalServerError: {
          description: "Internal server error.",
        },
      },

      schemas: {
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
      },
    },
  },

  apis: ["src/docs/paths/*.ts"],
});