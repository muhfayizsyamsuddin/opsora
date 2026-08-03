export const authSchemas = {
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        example: "admin@example.com",
      },
      password: {
        type: "string",
        example: "password123",
      },
    },
  },

  RegisterRequest: {
    type: "object",
    required: ["name", "email", "password", "role"],
    properties: {
      name: {
        type: "string",
        example: "Admin",
      },
      email: {
        type: "string",
        example: "admin@example.com",
      },
      password: {
        type: "string",
        example: "password123",
      },
      role: {
        type: "string",
        enum: ["ADMIN", "MANAGER", "STAFF"],
      },
    },
  },

  LoginResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "Login successful",
      },
      data: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGc...",
          },
        },
      },
    },
  },

  RegisterResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      message: {
        type: "string",
        example: "User registered successfully",
      },
      data: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "uuid",
          },
          name: {
            type: "string",
            example: "Admin",
          },
          email: {
            type: "string",
            example: "admin@example.com",
          },
          role: {
            type: "string",
            example: "ADMIN",
          },
        },
      },
    },
  },
};