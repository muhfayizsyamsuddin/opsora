import { z } from "zod";

export const performanceReviewFormSchema =
  z.object({
    employeeId: z
      .string()
      .uuid("Please select an employee."),

    reviewerId: z
      .string()
      .uuid("Please select a reviewer."),

    reviewPeriod: z
      .string()
      .trim()
      .min(
        1,
        "Review period is required.",
      )
      .max(
        20,
        "Review period must be at most 20 characters.",
      ),

    score: z.coerce
      .number()
      .int("Score must be a whole number.")
      .min(
        1,
        "Score must be at least 1.",
      )
      .max(
        100,
        "Score must be at most 100.",
      ),

    comments: z.string().optional(),
  });

export type PerformanceReviewFormInput =
  z.input<
    typeof performanceReviewFormSchema
  >;

export type PerformanceReviewFormValues =
  z.output<
    typeof performanceReviewFormSchema
  >;