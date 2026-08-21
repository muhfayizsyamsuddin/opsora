export const userSchemas = {
  User: {
    type: "object",
    required: [
      "id",
      "name",
      "email",
      "role",
      "roleId",
      "isActive",
      "createdAt",
      "updatedAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Super Admin Test",
      },

      email: {
        type: "string",
        format: "email",
        example: "superadmin@opsora.test",
      },

      role: {
        type: "string",
        nullable: true,
        example: "SUPER_ADMIN",
      },

      roleId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

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

  CreateUserRequest: {
    type: "object",
    required: [
      "name",
      "email",
      "password",
      "roleId",
    ],
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "John Doe",
      },

      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      password: {
        type: "string",
        format: "password",
        minLength: 8,
        example: "password123",
      },

      roleId: {
        type: "string",
        format: "uuid",
      },
    },
  },

  UpdateUserRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 100,
      },

      email: {
        type: "string",
        format: "email",
      },

      roleId: {
        type: "string",
        format: "uuid",
      },
    },
  },

  AssignUserRoleRequest: {
    type: "object",
    required: ["roleId"],
    properties: {
      roleId: {
        type: "string",
        format: "uuid",
      },
    },
  },

  EffectivePermissions: {
    type: "object",
    required: [
      "userId",
      "role",
      "permissions",
    ],
    properties: {
      userId: {
        type: "string",
        format: "uuid",
      },

      role: {
        type: "string",
        nullable: true,
        example: "SUPER_ADMIN",
      },

      permissions: {
        type: "array",
        items: {
          type: "string",
        },
        example: [
          "users.read",
          "users.create",
          "roles.read",
        ],
      },
    },
  },

  UserCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/User",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};