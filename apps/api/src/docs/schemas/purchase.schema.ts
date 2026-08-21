export const purchaseSchemas = {
  PurchaseItem: {
    type: "object",
    required: [
      "id",
      "purchaseId",
      "productId",
      "quantity",
      "unitPrice",
      "subtotal",
      "product",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      purchaseId: {
        type: "string",
        format: "uuid",
      },

      productId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "string",
        example: "3",
      },

      unitPrice: {
        type: "string",
        example: "3000",
      },

      subtotal: {
        type: "string",
        example: "9000",
      },

      product: {
        $ref: "#/components/schemas/Product",
      },
    },
  },

  Purchase: {
    type: "object",
    required: [
      "id",
      "supplierId",
      "userId",
      "purchaseDate",
      "totalAmount",
      "status",
      "createdAt",
      "updatedAt",
      "supplier",
      "user",
      "items",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      supplierId: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      purchaseDate: {
        type: "string",
        format: "date-time",
      },

      totalAmount: {
        type: "string",
        example: "339000",
      },

      status: {
        type: "string",
        enum: [
          "DRAFT",
          "COMPLETED",
          "CANCELLED",
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

      supplier: {
        $ref: "#/components/schemas/Supplier",
      },

      user: {
        $ref: "#/components/schemas/User",
      },

      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/PurchaseItem",
        },
      },
    },
  },

  CreatePurchaseRequest: {
    type: "object",
    required: [
      "supplierId",
      "purchaseDate",
      "items",
    ],
    properties: {
      supplierId: {
        type: "string",
        format: "uuid",
      },

      purchaseDate: {
        type: "string",
        format: "date-time",
      },

      items: {
        type: "array",
        minItems: 1,
        items: {
          $ref: "#/components/schemas/PurchaseItemRequest",
        },
      },
    },
  },

  PurchaseItemRequest: {
    type: "object",
    required: [
      "productId",
      "quantity",
      "unitPrice",
    ],
    properties: {
      productId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "number",
        exclusiveMinimum: 0,
        example: 3,
      },

      unitPrice: {
        type: "number",
        minimum: 0,
        example: 3000,
      },
    },
  },

  UpdatePurchaseRequest: {
    type: "object",
    properties: {
      supplierId: {
        type: "string",
        format: "uuid",
      },

      purchaseDate: {
        type: "string",
        format: "date-time",
      },

      items: {
        type: "array",
        minItems: 1,
        items: {
          $ref: "#/components/schemas/PurchaseItemRequest",
        },
      },
    },
  },

  PurchaseCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Purchase",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};