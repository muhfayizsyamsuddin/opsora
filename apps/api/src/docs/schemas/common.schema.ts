export const commonSchemas = {
  SuccessResponse: {
    type: "object",
    required: [
      "success",
      "message",
      "data",
    ],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Success",
      },
      data: {},
    },
  },

  ErrorResponse: {
    type: "object",
    required: [
      "success",
      "error",
    ],
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      error: {
        type: "object",
        required: [
          "code",
          "message",
        ],
        properties: {
          code: {
            type: "string",
            example: "VALIDATION_ERROR",
          },
          message: {
            type: "string",
            example: "Validation failed.",
          },
          details: {
            type: "object",
            additionalProperties: true,
            example: {
              email: [
                "Email is required.",
              ],
            },
          },
        },
      },
    },
  },
};