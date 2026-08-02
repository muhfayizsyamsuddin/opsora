import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),

    email: z.email(),

    password: z.string().min(8),

    role: z.enum(["ADMIN", "MANAGER", "STAFF"]).optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});