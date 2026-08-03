import swaggerJsdoc from "swagger-jsdoc";

import { authSchemas } from "./schemas/auth.schema.js";
import { commonSchemas } from "./schemas/common.schema.js";
import { departmentSchemas } from "./schemas/department.schema.js";
import { employeeSchemas } from "./schemas/employee.schema.js";

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
      },
    },
  },

  apis: ["src/docs/paths/*.ts"],
});