export const employeeSchemas = {
  Employee: {
    type: "object",
    required: [
      "id",
      "name",
      "email",
      "position",
      "salary",
      "hireDate",
      "status",
      "departmentId",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "John Doe",
      },

      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      position: {
        type: "string",
        example: "Software Engineer",
      },

      salary: {
        type: "number",
        example: 15000000,
      },

      hireDate: {
        type: "string",
        format: "date-time",
        example: "2026-08-02T00:00:00.000Z",
      },

      status: {
        type: "string",
        example: "ACTIVE",
      },

      departmentId: {
        type: "string",
        format: "uuid",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  CreateEmployeeRequest: {
    type: "object",
    required: [
      "name",
      "email",
      "position",
      "salary",
      "hireDate",
      "departmentId",
    ],
    properties: {
      name: {
        type: "string",
        example: "John Doe",
      },

      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      position: {
        type: "string",
        example: "Software Engineer",
      },

      salary: {
        type: "number",
        example: 15000000,
      },

      hireDate: {
        type: "string",
        format: "date",
        example: "2026-08-02",
      },

      departmentId: {
        type: "string",
        format: "uuid",
      },
    },
  },

  UpdateEmployeeRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        example: "John Doe",
      },

      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      position: {
        type: "string",
        example: "Senior Software Engineer",
      },

      salary: {
        type: "number",
        example: 18000000,
      },

      hireDate: {
        type: "string",
        format: "date",
        example: "2026-08-01",
      },

      departmentId: {
        type: "string",
        format: "uuid",
      },
    },
  },
};