export const departmentSchemas = {
  Department: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "0078e33f-488a-4e0c-90ba-14b3e13456a7",
      },
      name: {
        type: "string",
        example: "IT",
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

  CreateDepartmentRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        example: "Finance",
      },
    },
  },

  UpdateDepartmentRequest: {
    type: "object",
    properties: {
      name: {
        type: "string",
        example: "Human Resources",
      },
    },
  },

  DepartmentResponse: {
    type: "object",
    properties: {
      success: {
        type: "boolean",
        example: true
      },
      message: {
        type: "string",
        example: "Success"
      },
      data: {
        $ref: "#/components/schemas/Department"
      }
    }
  }
};