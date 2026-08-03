export const performanceReviewSchemas = {
  PerformanceReview: {
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
      reviewer: {
        type: "string",
        example: "John Manager",
      },
      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        example: 92,
      },
      comments: {
        type: "string",
        example: "Excellent teamwork and communication.",
      },
      reviewDate: {
        type: "string",
        format: "date-time",
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

  CreatePerformanceReviewRequest: {
    type: "object",
    required: [
      "employeeId",
      "reviewer",
      "score",
      "reviewDate",
    ],
    properties: {
      employeeId: {
        type: "string",
        format: "uuid",
      },
      reviewer: {
        type: "string",
        example: "John Manager",
      },
      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        example: 90,
      },
      comments: {
        type: "string",
        example: "Outstanding performance.",
      },
      reviewDate: {
        type: "string",
        format: "date-time",
      },
    },
  },

  UpdatePerformanceReviewRequest: {
    type: "object",
    properties: {
      reviewer: {
        type: "string",
      },
      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },
      comments: {
        type: "string",
      },
      reviewDate: {
        type: "string",
        format: "date-time",
      },
    },
  },
};