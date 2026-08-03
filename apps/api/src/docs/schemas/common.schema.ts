export const commonSchemas = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: false,
      },
      message: {
        type: "string",
        example: "Something went wrong",
      },
    },
  },
};