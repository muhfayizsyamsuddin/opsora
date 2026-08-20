import { z } from "zod";

const purchaseItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

export const createPurchaseSchema = z.object({
  body: z.object({
    supplierId: z.string().uuid(),
    purchaseDate: z.coerce.date(),
    items: z.array(purchaseItemSchema).min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getPurchasesSchema = z.object({
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

    supplier_id: z.string().uuid().optional(),

    date_from: z.coerce.date().optional(),

    date_to: z.coerce.date().optional(),

    sort_by: z
      .enum(["purchaseDate", "createdAt", "totalAmount"])
      .default("purchaseDate"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const getPurchaseByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const purchaseActionSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updatePurchaseSchema = z.object({
  body: z.object({
    supplierId: z.string().uuid().optional(),
    purchaseDate: z.coerce.date().optional(),
    items: z.array(purchaseItemSchema).min(1).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});