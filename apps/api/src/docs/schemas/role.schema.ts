export const roleSchemas = {
  Role: {
    type: "object",
    required: [
      "id",
      "name",
      "description",
      "permissions",
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
        example: "ADMIN",
      },

      description: {
        type: "string",
        nullable: true,
        example:
          "Operational and business data management",
      },

      permissions: {
        type: "array",
        items: {
          type: "string",
        },
        example: [
          "products.read",
          "products.create",
          "users.read",
        ],
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

  CreateRoleRequest: {
    type: "object",
    required: [
      "name",
    ],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "MANAGER",
      },

      description: {
        type: "string",
        maxLength: 255,
        example:
          "Store management role",
      },

      permissions: {
        type: "array",
        default: [],
        items: {
          type: "string",
          minLength: 1,
        },
        example: [
          "products.read",
          "products.update",
        ],
      },
    },
  },

  UpdateRoleRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "MANAGER",
      },

      description: {
        type: "string",
        maxLength: 255,
        example:
          "Updated role description",
      },

      permissions: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
        },
        example: [
          "products.read",
          "products.update",
        ],
      },
    },
  },

  UpdateRolePermissionsRequest: {
    type: "object",
    required: ["permissions"],
    properties: {
      permissions: {
        type: "array",
        items: {
          type: "string",
          minLength: 1,
        },
        example: [
          "products.read",
          "sales.read",
        ],
      },
    },
  },

  RoleCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Role",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },

  RoleDeleteResponse: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "Role deleted successfully",
      },
    },
  },
};