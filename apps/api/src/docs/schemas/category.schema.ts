export const categorySchemas = {
  Category: {
    type: "object",
    required: [
      "id",
      "name",
      "description",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Minuman",
      },

      description: {
        type: "string",
        nullable: true,
        maxLength: 500,
        example: "Produk minuman",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },

      deletedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
  },

  CreateCategoryRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Minuman",
      },

      description: {
        type: "string",
        maxLength: 500,
        example: "Produk minuman",
      },
    },
  },

  UpdateCategoryRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Minuman",
      },

      description: {
        type: "string",
        maxLength: 500,
        example: "Produk minuman",
      },
    },
  },

  CategoryCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Category",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};