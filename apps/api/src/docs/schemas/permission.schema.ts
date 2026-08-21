export const permissionSchemas = {
  Permission: {
    type: "object",
    required: [
      "id",
      "name",
      "description",
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
        example: "products.read",
      },

      description: {
        type: "string",
        nullable: true,
        example: "View products",
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

  PermissionCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Permission",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};