import { z } from "zod";

export const leaveFormSchema = z
  .object({
    employeeId: z.string().min(
      1,
      "Employee is required.",
    ),

    startDate: z.string().min(
      1,
      "Start date is required.",
    ),

    endDate: z.string().min(
      1,
      "End date is required.",
    ),

    reason: z.string().min(
      1,
      "Reason is required.",
    ),
  })
  .refine(
    (data) =>
      data.endDate >= data.startDate,
    {
      message:
        "End date must be on or after start date.",
      path: ["endDate"],
    },
  );

export type LeaveFormValues =
  z.infer<typeof leaveFormSchema>;