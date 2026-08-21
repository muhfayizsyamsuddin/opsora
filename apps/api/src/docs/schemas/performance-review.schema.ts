export const performanceReviewSchemas = {
  PerformanceReview: {
    type: "object",
    required: [
      "id",
      "employeeId",
      "reviewerId",
      "reviewPeriod",
      "score",
      "reviewDate",
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

      reviewerLegacy: {
        type: "string",
        nullable: true,
        example: "Owner",
      },

      reviewerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      reviewPeriod: {
        type: "string",
        nullable: true,
        example: "2026-Q3",
      },

      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        example: 85,
      },

      comments: {
        type: "string",
        nullable: true,
        example: "Good performance",
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
      "employee_id",
      "reviewer_id",
      "review_period",
      "score",
    ],
    properties: {
      employee_id: {
        type: "string",
        format: "uuid",
      },

      reviewer_id: {
        type: "string",
        format: "uuid",
      },

      review_period: {
        type: "string",
        minLength: 1,
        maxLength: 20,
        example: "2026-Q3",
      },

      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        example: 85,
      },

      comments: {
        type: "string",
        example: "Good performance",
      },
    },
  },

  UpdatePerformanceReviewRequest: {
    type: "object",
    properties: {
      reviewer_id: {
        type: "string",
        format: "uuid",
      },

      review_period: {
        type: "string",
        minLength: 1,
        maxLength: 20,
      },

      score: {
        type: "integer",
        minimum: 1,
        maximum: 100,
      },

      comments: {
        type: "string",
      },
    },
  },
};