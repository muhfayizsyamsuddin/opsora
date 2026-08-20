import { z } from "zod";

export const getPermissionsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export const getPermissionByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});