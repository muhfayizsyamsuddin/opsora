export const payrollSchemas = {
  Payroll: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      employeeId: {
        type: "string",
        format: "uuid",
      },
      month: {
        type: "integer",
        minimum: 1,
        maximum: 12,
        example: 8,
      },
      year: {
        type: "integer",
        example: 2026,
      },
      baseSalary: {
        type: "number",
        example: 5000000,
      },
      bonus: {
        type: "number",
        example: 500000,
      },
      deduction: {
        type: "number",
        example: 250000,
      },
      totalSalary: {
        type: "number",
        example: 5250000,
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

  CreatePayrollRequest: {
    type: "object",
    required: [
      "employeeId",
      "month",
      "year",
    ],
    properties: {
      employeeId: {
        type: "string",
        format: "uuid",
      },
      month: {
        type: "integer",
        minimum: 1,
        maximum: 12,
        example: 8,
      },
      year: {
        type: "integer",
        minimum: 2000,
        maximum: 3000,
        example: 2026,
      },
      bonus: {
        type: "number",
        default: 0,
        example: 500000,
      },
      deduction: {
        type: "number",
        default: 0,
        example: 250000,
      },
    },
  },
};