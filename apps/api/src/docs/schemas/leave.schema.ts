export const leaveSchemas = {
  Leave: {
    type: "object",
    required: [
      "id",
      "employeeId",
      "reviewerId",
      "startDate",
      "endDate",
      "reason",
      "status",
      "reviewedAt",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      employeeId: {
        type: "string",
        format: "uuid",
      },

      reviewerId: {
        type: "string",
        format: "uuid",
        nullable: true,
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
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
          "CANCELLED",
        ],
        example: "PENDING",
      },

      reviewedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
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
    },
  },
};