export const dashboardSchemas = {
  DashboardStatistics: {
    type: "object",
    properties: {
      totalEmployees: {
        type: "integer",
        example: 45,
      },
      totalDepartments: {
        type: "integer",
        example: 6,
      },
      totalPayrolls: {
        type: "integer",
        example: 45,
      },
      totalAttendanceToday: {
        type: "integer",
        example: 38,
      },
      pendingLeaves: {
        type: "integer",
        example: 3,
      },
      performanceReviews: {
        type: "integer",
        example: 40,
      },
    },
  },
};