export const inventorySchemas = {
  InventoryStock: {
    type: "object",
    required: [
      "id",
      "name",
      "sku",
      "stock",
      "minimumStock",
      "unit",
      "status",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Air Mineral",
      },

      sku: {
        type: "string",
        example: "AM-001",
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

      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
        example: "ACTIVE",
      },
    },
  },

  InventoryStockCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/InventoryStock",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },

  InventoryMovementProduct: {
    type: "object",
    required: [
      "id",
      "name",
      "sku",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Air Mineral",
      },

      sku: {
        type: "string",
        example: "AM-001",
      },
    },
  },

  InventoryMovement: {
    type: "object",
    required: [
      "id",
      "productId",
      "userId",
      "movementType",
      "referenceType",
      "referenceId",
      "quantity",
      "beforeStock",
      "afterStock",
      "reason",
      "createdAt",
      "product",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      productId: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      movementType: {
        type: "string",
        enum: ["IN", "OUT"],
      },

      referenceType: {
        type: "string",
        enum: [
          "PURCHASE",
          "SALE",
          "ADJUSTMENT",
        ],
      },

      referenceId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      quantity: {
        type: "string",
        example: "2",
      },

      beforeStock: {
        type: "string",
        example: "10",
      },

      afterStock: {
        type: "string",
        example: "12",
      },

      reason: {
        type: "string",
        nullable: true,
        example: "Physical stock correction",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      product: {
        $ref: "#/components/schemas/InventoryMovementProduct",
      },
    },
  },

  InventoryMovementCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/InventoryMovement",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },

  CreateInventoryAdjustmentRequest: {
    type: "object",
    required: [
      "product_id",
      "movement_type",
      "quantity",
      "reason",
    ],
    properties: {
      product_id: {
        type: "string",
        format: "uuid",
      },

      movement_type: {
        type: "string",
        enum: ["IN", "OUT"],
      },

      quantity: {
        type: "number",
        exclusiveMinimum: 0,
        example: 2,
      },

      reason: {
        type: "string",
        minLength: 3,
        maxLength: 500,
        example: "Physical stock correction",
      },
    },
  },

  InventoryAdjustmentResult: {
    type: "object",
    required: [
      "product",
      "movement",
    ],
    properties: {
      product: {
        type: "object",
        required: [
          "id",
          "name",
          "stock",
        ],
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },

          name: {
            type: "string",
            example: "Air Mineral",
          },

          stock: {
            type: "string",
            example: "12",
          },
        },
      },

      movement: {
        $ref: "#/components/schemas/InventoryMovement",
      },
    },
  },
};