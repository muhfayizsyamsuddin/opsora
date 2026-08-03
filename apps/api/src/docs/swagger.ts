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

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Opsora API",
      version: "1.0.0",
      description: "HR Management System API",
    },

    servers: [
      {
        url: "http://localhost:3001",
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
      },
    },
  },

  apis: ["src/docs/paths/*.ts"],
});