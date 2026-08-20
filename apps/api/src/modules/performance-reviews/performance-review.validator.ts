import { z } from "zod";

export const createPerformanceReviewSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid(),
    reviewer: z.string().min(1),
    score: z.number().int().min(1).max(100),
    comments: z.string().optional(),
    reviewDate: z.coerce.date(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updatePerformanceReviewSchema = z.object({
  body: z.object({
    reviewer: z.string().min(1).optional(),
    score: z.number().int().min(1).max(100).optional(),
    comments: z.string().optional(),
    reviewDate: z.coerce.date().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getPerformanceReviewByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getPerformanceReviewsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    employee_id: z.string().uuid().optional(),

    reviewer: z.string().optional(),

    score_min: z.coerce
      .number()
      .int()
      .min(0)
      .max(100)
      .optional(),

    score_max: z.coerce
      .number()
      .int()
      .min(0)
      .max(100)
      .optional(),

    search: z.string().optional(),

    sort_by: z
      .enum([
        "reviewDate",
        "score",
        "createdAt",
      ])
      .default("reviewDate"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const deletePerformanceReviewSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getPerformanceReviewEmployeeSchema = z.object({
  body: z.object({}),
  params: z.object({
    employee_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    reviewer: z.string().optional(),

    score_min: z.coerce
      .number()
      .int()
      .min(0)
      .max(100)
      .optional(),

    score_max: z.coerce
      .number()
      .int()
      .min(0)
      .max(100)
      .optional(),

    sort_by: z
      .enum([
        "reviewDate",
        "score",
        "createdAt",
      ])
      .default("reviewDate"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});