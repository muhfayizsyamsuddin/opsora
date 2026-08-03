export const leaveSchemas = {
  Leave: {
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
      startDate: {
        type: "string",
        format: "date-time",
      },
      endDate: {
        type: "string",
        format: "date-time",
      },
      reason: {
        type: "string",
        example: "Annual leave",
      },
      status: {
        type: "string",
        enum: ["PENDING", "APPROVED", "REJECTED"],
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

  CreateLeaveRequest: {
    type: "object",
    required: [
      "employeeId",
      "startDate",
      "endDate",
      "reason",
    ],
    properties: {
      employeeId: {
        type: "string",
        format: "uuid",
      },
      startDate: {
        type: "string",
        format: "date-time",
      },
      endDate: {
        type: "string",
        format: "date-time",
      },
      reason: {
        type: "string",
        minLength: 5,
        maxLength: 500,
        example: "Annual leave",
      },
    },
  },

  UpdateLeaveRequest: {
    type: "object",
    properties: {
      startDate: {
        type: "string",
        format: "date-time",
      },
      endDate: {
        type: "string",
        format: "date-time",
      },
      reason: {
        type: "string",
        minLength: 5,
        maxLength: 500,
      },
      status: {
        type: "string",
        enum: ["PENDING", "APPROVED", "REJECTED"],
      },
    },
  },
};