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