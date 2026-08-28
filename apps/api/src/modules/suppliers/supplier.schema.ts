import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(150).optional(),
    address: z.string().max(500).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getSuppliersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

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

export const getSupplierByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    phone: z
      .string()
      .max(30)
      .nullable()
      .optional(),
    email: z
      .string()
      .email()
      .max(150)
      .nullable()
      .optional(),
    address: z
      .string()
      .max(500)
      .nullable()
      .optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const deleteSupplierSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});