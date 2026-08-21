import { z } from "zod";

export const getPermissionsSchema = z.object({
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
      .default("name"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("asc"),
  }),
});

export const getPermissionByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});