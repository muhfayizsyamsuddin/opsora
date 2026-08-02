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
  query: z.object({}),
});

export const deletePerformanceReviewSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});