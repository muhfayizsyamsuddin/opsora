import { z } from "zod";

export const attendanceFormSchema =
  z
    .object({
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
    })
    .superRefine((values, ctx) => {
      if (
        !values.checkIn ||
        !values.checkOut
      ) {
        return;
      }

      const checkIn =
        new Date(values.checkIn);

      const checkOut =
        new Date(values.checkOut);

      if (
        checkOut.getTime() <
        checkIn.getTime()
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOut"],
          message:
            "Check out cannot be earlier than check in",
        });
      }
    });

export type AttendanceFormValues =
  z.infer<
    typeof attendanceFormSchema
  >;