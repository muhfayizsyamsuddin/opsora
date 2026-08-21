export const customerSchemas = {
  Customer: {
    type: "object",
    required: [
      "id",
      "name",
      "phone",
      "email",
      "address",
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
        maxLength: 150,
        example: "Budi Santoso",
      },

      phone: {
        type: "string",
        nullable: true,
        maxLength: 30,
        example: "08123456789",
      },

      email: {
        type: "string",
        format: "email",
        nullable: true,
        maxLength: 150,
        example: "budi@example.com",
      },

      address: {
        type: "string",
        nullable: true,
        maxLength: 500,
        example: "Jakarta",
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

  CreateCustomerRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 150,
        example: "Budi Santoso",
      },

      phone: {
        type: "string",
        maxLength: 30,
        example: "08123456789",
      },

      email: {
        type: "string",
        format: "email",
        maxLength: 150,
        example: "budi@example.com",
      },

      address: {
        type: "string",
        maxLength: 500,
        example: "Jakarta",
      },
    },
  },

  UpdateCustomerRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 150,
      },

      phone: {
        type: "string",
        maxLength: 30,
      },

      email: {
        type: "string",
        format: "email",
        maxLength: 150,
      },

      address: {
        type: "string",
        maxLength: 500,
      },
    },
  },

  CustomerCollection: {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Customer",
        },
      },

      meta: {
        $ref: "#/components/schemas/PaginationMeta",
      },
    },
  },
};