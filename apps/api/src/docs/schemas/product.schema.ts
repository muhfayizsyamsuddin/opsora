export const productSchemas = {
  Product: {
    type: "object",
    required: [
      "id",
      "categoryId",
      "name",
      "sku",
      "barcode",
      "purchasePrice",
      "sellingPrice",
      "stock",
      "minimumStock",
      "unit",
      "imageUrl",
      "status",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "category",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      categoryId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        minLength: 2,
        maxLength: 150,
        example: "Air Mineral",
      },

      sku: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        example: "AM-001",
      },

      barcode: {
        type: "string",
        nullable: true,
        example: "8999999999999",
      },

      purchasePrice: {
        type: "string",
        example: "3000",
      },

      sellingPrice: {
        type: "string",
        example: "5000",
      },

      stock: {
        type: "string",
        example: "12",
      },

      minimumStock: {
        type: "string",
        example: "10",
      },

      unit: {
        type: "string",
        example: "pcs",
      },

      imageUrl: {
        type: "string",
        format: "uri",
        nullable: true,
      },

      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
        example: "ACTIVE",
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

      category: {
        $ref: "#/components/schemas/Category",
      },
    },
  },

  CreateProductRequest: {
    type: "object",
    required: [
      "categoryId",
      "name",
      "sku",
      "purchasePrice",
      "sellingPrice",
      "unit",
    ],
    properties: {
      categoryId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        minLength: 2,
        maxLength: 150,
        example: "Air Mineral",
      },

      sku: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        example: "AM-001",
      },

      barcode: {
        type: "string",
        maxLength: 100,
      },

      purchasePrice: {
        type: "number",
        minimum: 0,
        example: 3000,
      },

      sellingPrice: {
        type: "number",
        minimum: 0,
        example: 5000,
      },

      stock: {
        type: "number",
        minimum: 0,
        default: 0,
        example: 0,
      },

      minimumStock: {
        type: "number",
        minimum: 0,
        default: 0,
        example: 10,
      },

      unit: {
        type: "string",
        minLength: 1,
        maxLength: 20,
        example: "pcs",
      },

      imageUrl: {
        type: "string",
        format: "uri",
      },

      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
      },
    },
  },

  UpdateProductRequest: {
    type: "object",
    properties: {
      categoryId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        minLength: 2,
        maxLength: 150,
      },

      sku: {
        type: "string",
        minLength: 1,
        maxLength: 50,
      },

      barcode: {
        type: "string",
        maxLength: 100,
      },

      purchasePrice: {
        type: "number",
        minimum: 0,
      },

      sellingPrice: {
        type: "number",
        minimum: 0,
      },

      minimumStock: {
        type: "number",
        minimum: 0,
      },

      unit: {
        type: "string",
        minLength: 1,
        maxLength: 20,
      },

      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
      },

      imageUrl: {
        type: "string",
        format: "uri",
      },
    },
  },

  ProductCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Product",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};