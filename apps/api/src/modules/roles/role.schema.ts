import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(255).optional(),
    permissions: z.array(z.string().min(1)).default([])
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(255).optional(),
    permissions: z.array(z.string().min(1)).optional()
  }),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const getRoleByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const getRolesSchema = z.object({
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

export const deleteRoleSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const updateRolePermissionsSchema = z.object({
  body: z.object({
    permissions: z.array(
      z.string().min(1),
    ),
  }),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});