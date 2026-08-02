import { z } from "zod";
import { UserRole } from "../../generated/prisma/enums.js";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(UserRole).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
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
    role: z.nativeEnum(UserRole).optional(),
    sort: z
      .enum(["name", "email", "role", "createdAt"])
      .default("createdAt"),

    order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});