import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const logoutSchema = z.object({
  body: z.object({
    refresh_token: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});