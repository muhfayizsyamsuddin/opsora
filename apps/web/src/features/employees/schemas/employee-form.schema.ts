import { z } from "zod";

export const employeeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      3,
      "Employee name must be at least 3 characters",
    )
    .max(
      100,
      "Employee name must not exceed 100 characters",
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(
      255,
      "Email must not exceed 255 characters",
    ),

  position: z
    .string()
    .trim()
    .min(
      2,
      "Position must be at least 2 characters",
    )
    .max(
      100,
      "Position must not exceed 100 characters",
    ),

  salary: z
    .number()
    .positive(
      "Salary must be greater than 0",
    ),

  hireDate: z
    .string()
    .min(1, "Hire date is required"),

  departmentId: z
    .string()
    .min(1, "Department is required"),
  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),
});

export type EmployeeFormValues =
  z.infer<typeof employeeFormSchema>;