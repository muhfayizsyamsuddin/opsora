export const attendanceSchemas = {
  Attendance: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
      employeeId: {
        type: "string",
        format: "uuid",
        example: "2f1dde6e-7034-4c24-b0f8-08317ce427f4",
      },
      checkIn: {
        type: "string",
        format: "date-time",
        example: "2026-08-03T08:00:00.000Z",
      },
      checkOut: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-08-03T17:00:00.000Z",
      },
      status: {
        type: "string",
        enum: ["PRESENT", "LATE", "ABSENT"],
        example: "PRESENT",
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

  CreateAttendanceRequest: {
    type: "object",
    required: ["employeeId", "checkIn"],
    properties: {
      employeeId: {
        type: "string",
        format: "uuid",
        example: "2f1dde6e-7034-4c24-b0f8-08317ce427f4",
      },
      checkIn: {
        type: "string",
        format: "date-time",
        example: "2026-08-03T08:00:00.000Z",
      },
      checkOut: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: "2026-08-03T17:00:00.000Z",
      },
      status: {
        type: "string",
        enum: ["PRESENT", "LATE", "ABSENT"],
        example: "PRESENT",
      },
    },
  },

  UpdateAttendanceRequest: {
    type: "object",
    properties: {
      checkOut: {
        type: "string",
        format: "date-time",
        example: "2026-08-03T17:00:00.000Z",
      },
      status: {
        type: "string",
        enum: ["PRESENT", "LATE", "ABSENT"],
        example: "LATE",
      },
    },
  },
};