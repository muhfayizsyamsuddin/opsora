import { z } from "zod";

export const attendanceFormSchema =
  z.object({
    employeeId: z
      .string()
      .uuid("Employee is required"),

    checkIn: z
      .string()
      .min(
        1,
        "Check in is required",
      ),

    checkOut: z
      .string()
      .optional(),

    status: z
      .enum([
        "PRESENT",
        "LATE",
        "ABSENT",
        "LEAVE",
      ])
      .optional(),
  });

export type AttendanceFormValues =
  z.infer<
    typeof attendanceFormSchema
  >;