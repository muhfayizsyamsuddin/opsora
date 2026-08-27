import { z } from "zod";

export const payrollFormSchema = z.object({
  employeeId: z
    .string()
    .uuid("Please select an employee."),

  month: z
    .number()
    .int()
    .min(1, "Please select a month.")
    .max(12, "Please select a valid month."),

  year: z
    .number()
    .int()
    .min(2000, "Year must be at least 2000.")
    .max(3000, "Year must be at most 3000."),

  bonus: z
    .number()
    .min(0, "Bonus cannot be negative."),

  deduction: z
    .number()
    .min(0, "Deduction cannot be negative."),
});

export type PayrollFormValues =
  z.infer<typeof payrollFormSchema>;