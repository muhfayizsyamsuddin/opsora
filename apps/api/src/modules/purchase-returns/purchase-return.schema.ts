import { z } from "zod";

export const createPurchaseReturnSchema = z.object({
  body: z.object({
    purchaseId: z.string().uuid(),
    returnDate: z.coerce.date(),
    reason: z.string().trim().min(1).optional(),
    items: z
      .array(
        z.object({
          purchaseItemId: z.string().uuid(),
          quantity: z.coerce.number().positive(),
        }),
      )
      .min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getPurchaseReturnsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().optional(),

    status: z
      .enum(["DRAFT", "COMPLETED", "CANCELLED"])
      .optional(),

    purchase_id: z.string().uuid().optional(),

    date_from: z.coerce.date().optional(),
    date_to: z.coerce.date().optional(),

    sort_by: z
      .enum(["returnDate", "createdAt", "totalAmount"])
      .default("returnDate"),

    sort_order: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export const getPurchaseReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const completePurchaseReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const cancelPurchaseReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});