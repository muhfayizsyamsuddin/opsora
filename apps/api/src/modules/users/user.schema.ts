import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    roleId: z.uuid(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    roleId: z.uuid().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const getUsersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    roleId: z.uuid().optional(),
    sort: z
      .enum(["name", "email", "createdAt"])
      .default("createdAt"),
    order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const assignUserRoleSchema = z.object({
  body: z.object({
    roleId: z.uuid(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const deleteUserSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});

export const getUserPermissionsSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({}),
});