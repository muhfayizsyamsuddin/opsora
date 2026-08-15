import { z } from "zod";

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(150).optional(),
    address: z.string().max(500).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getCustomersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    sort: z.enum(["name", "createdAt"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export const getCustomerByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(150).optional(),
    address: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const deleteCustomerSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});