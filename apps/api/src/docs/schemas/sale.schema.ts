export const saleSchemas = {
  SaleItem: {
    type: "object",
    required: [
      "id",
      "saleId",
      "productId",
      "quantity",
      "unitPrice",
      "discount",
      "subtotal",
      "product",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      saleId: {
        type: "string",
        format: "uuid",
      },

      productId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "string",
        example: "2",
      },

      unitPrice: {
        type: "string",
        example: "5000",
      },

      discount: {
        type: "string",
        example: "0",
      },

      subtotal: {
        type: "string",
        example: "10000",
      },

      product: {
        $ref: "#/components/schemas/Product",
      },
    },
  },

  Sale: {
    type: "object",
    required: [
      "id",
      "customerId",
      "userId",
      "saleDate",
      "subtotal",
      "discount",
      "totalAmount",
      "paymentMethod",
      "status",
      "createdAt",
      "updatedAt",
      "customer",
      "user",
      "items",
    ],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      customerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      saleDate: {
        type: "string",
        format: "date-time",
      },

      subtotal: {
        type: "string",
        example: "10000",
      },

      discount: {
        type: "string",
        example: "0",
      },

      totalAmount: {
        type: "string",
        example: "10000",
      },

      paymentMethod: {
        type: "string",
        enum: [
          "CASH",
          "TRANSFER",
          "QRIS",
        ],
      },

      status: {
        type: "string",
        enum: [
          "PENDING",
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

      customer: {
        allOf: [
          {
            $ref: "#/components/schemas/Customer",
          },
        ],
        nullable: true,
      },

      user: {
        $ref: "#/components/schemas/User",
      },

      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SaleItem",
        },
      },
    },
  },

  SaleItemRequest: {
    type: "object",
    required: [
      "productId",
      "quantity",
    ],
    properties: {
      productId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "number",
        exclusiveMinimum: 0,
        example: 2,
      },

      discount: {
        type: "number",
        minimum: 0,
        default: 0,
        example: 0,
      },
    },
  },

  CreateSaleRequest: {
    type: "object",
    required: [
      "saleDate",
      "paymentMethod",
      "items",
    ],
    properties: {
      customerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      saleDate: {
        type: "string",
        format: "date-time",
      },

      paymentMethod: {
        type: "string",
        enum: [
          "CASH",
          "TRANSFER",
          "QRIS",
        ],
      },

      discount: {
        type: "number",
        minimum: 0,
        default: 0,
        example: 0,
      },

      items: {
        type: "array",
        minItems: 1,
        items: {
          $ref: "#/components/schemas/SaleItemRequest",
        },
      },
    },
  },

  UpdateSaleRequest: {
    type: "object",
    properties: {
      customerId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      saleDate: {
        type: "string",
        format: "date-time",
      },

      paymentMethod: {
        type: "string",
        enum: [
          "CASH",
          "TRANSFER",
          "QRIS",
        ],
      },

      discount: {
        type: "number",
        minimum: 0,
      },

      items: {
        type: "array",
        minItems: 1,
        items: {
          $ref: "#/components/schemas/SaleItemRequest",
        },
      },
    },
  },

  SaleCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Sale",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },

  SaleInvoiceItem: {
    type: "object",
    required: [
      "productId",
      "productName",
      "quantity",
      "unitPrice",
      "discount",
      "subtotal",
    ],
    properties: {
      productId: {
        type: "string",
        format: "uuid",
      },

      productName: {
        type: "string",
        example: "Air Mineral",
      },

      quantity: {
        type: "string",
        example: "2",
      },

      unitPrice: {
        type: "string",
        example: "5000",
      },

      discount: {
        type: "string",
        example: "0",
      },

      subtotal: {
        type: "string",
        example: "10000",
      },
    },
  },

  SaleInvoice: {
    type: "object",
    required: [
      "invoiceNumber",
      "saleId",
      "saleDate",
      "paymentMethod",
      "customer",
      "cashier",
      "items",
      "subtotal",
      "discount",
      "totalAmount",
      "status",
    ],
    properties: {
      invoiceNumber: {
        type: "string",
        example: "INV-43B3498A",
      },

      saleId: {
        type: "string",
        format: "uuid",
      },

      saleDate: {
        type: "string",
        format: "date-time",
      },

      paymentMethod: {
        type: "string",
        enum: [
          "CASH",
          "TRANSFER",
          "QRIS",
        ],
      },

      customer: {
        type: "object",
        nullable: true,
        required: ["id", "name"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
        },
      },

      cashier: {
        type: "object",
        required: [
          "id",
          "name",
          "email",
        ],
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
        },
      },

      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/SaleInvoiceItem",
        },
      },

      subtotal: {
        type: "string",
        example: "10000",
      },

      discount: {
        type: "string",
        example: "0",
      },

      totalAmount: {
        type: "string",
        example: "10000",
      },

      status: {
        type: "string",
        enum: [
          "COMPLETED",
        ],
      },
    },
  },
};