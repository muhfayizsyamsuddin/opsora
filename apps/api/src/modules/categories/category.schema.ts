import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getCategoriesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    search: z.string().optional(),

    sort_by: z
      .enum(["name", "createdAt"])
      .default("createdAt"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const getCategoryByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const deleteCategorySchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});