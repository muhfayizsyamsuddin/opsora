export const authSchemas = {
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "admin@opsora.com",
      },
      password: {
        type: "string",
        format: "password",
        example: "password123",
      },
    },
  },

  LoginResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "object",
        required: [
          "access_token",
          "token_type",
          "refresh_token",
          "user",
        ],
        properties: {
          access_token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
          },
          token_type: {
            type: "string",
            example: "Bearer",
          },
          refresh_token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
          },
          user: {
            $ref: "#/components/schemas/AuthUser",
          },
        },
      },
    },
  },

  AuthUser: {
    type: "object",
    required: [
      "id",
      "name",
      "email",
      "roles",
      "permissions",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Admin",
      },
      email: {
        type: "string",
        format: "email",
        example: "admin@opsora.com",
      },
      roles: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["ADMIN"],
      },
      permissions: {
        type: "array",
        items: {
          type: "string",
        },
        example: [
          "products.read",
          "products.create",
        ],
      },
    },
  },

  MeResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        allOf: [
          {
            $ref: "#/components/schemas/AuthUser",
          },
          {
            type: "object",
            properties: {
              isActive: {
                type: "boolean",
                example: true,
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
        ],
      },
    },
  },

  RefreshTokenRequest: {
    type: "object",
    required: ["refresh_token"],
    properties: {
      refresh_token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIs...",
      },
    },
  },

  RefreshTokenResponse: {
    type: "object",
    required: ["success", "data"],
    properties: {
      success: {
        type: "boolean",
        example: true,
      },
      data: {
        type: "object",
        required: [
          "access_token",
          "token_type",
        ],
        properties: {
          access_token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
          },
          token_type: {
            type: "string",
            example: "Bearer",
          },
        },
      },
    },
  },

  LogoutRequest: {
    type: "object",
    required: ["refresh_token"],
    properties: {
      refresh_token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIs...",
      },
    },
  },
};