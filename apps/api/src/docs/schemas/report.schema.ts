export const reportSchemas = {
  DashboardReport: {
    type: "object",
    properties: {
      totalEmployees: {
        type: "integer",
        example: 25,
      },
      totalDepartments: {
        type: "integer",
        example: 5,
      },
      totalPayrolls: {
        type: "integer",
        example: 25,
      },
      totalAttendanceToday: {
        type: "integer",
        example: 21,
      },
      pendingLeaves: {
        type: "integer",
        example: 2,
      },
    },
  },

  AttendanceReport: {
    type: "object",
    properties: {
      totalAttendance: {
        type: "integer",
        example: 320,
      },
      present: {
        type: "integer",
        example: 300,
      },
      absent: {
        type: "integer",
        example: 20,
      },
    },
  },

  LeaveReport: {
    type: "object",
    properties: {
      totalLeaves: {
        type: "integer",
        example: 40,
      },
      approved: {
        type: "integer",
        example: 30,
      },
      pending: {
        type: "integer",
        example: 8,
      },
      rejected: {
        type: "integer",
        example: 2,
      },
    },
  },

  PayrollReport: {
    type: "object",
    properties: {
      totalPayroll: {
        type: "number",
        example: 120000000,
      },
      averageSalary: {
        type: "number",
        example: 5500000,
      },
    },
  },

  PerformanceReport: {
    type: "object",
    properties: {
      averageScore: {
        type: "number",
        example: 87.5,
      },
      highestScore: {
        type: "integer",
        example: 100,
      },
      lowestScore: {
        type: "integer",
        example: 65,
      },
    },
  },
};