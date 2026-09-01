import { z } from "zod";

export const createSaleReturnSchema = z.object({
  body: z.object({
    saleId: z.string().uuid(),

    returnDate: z.coerce.date(),

    reason: z
      .string()
      .trim()
      .min(1)
      .optional(),

    items: z
      .array(
        z.object({
          saleItemId: z.string().uuid(),
          quantity: z.coerce.number().positive(),
        }),
      )
      .min(1),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const getSaleReturnsSchema = z.object({
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

    search: z.string().trim().optional(),

    status: z
      .enum([
        "DRAFT",
        "COMPLETED",
        "CANCELLED",
      ])
      .optional(),

    sale_id: z.string().uuid().optional(),

    date_from: z.coerce.date().optional(),
    date_to: z.coerce.date().optional(),

    sort_by: z
      .enum([
        "returnDate",
        "createdAt",
        "totalAmount",
      ])
      .default("returnDate"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const getSaleReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const completeSaleReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const cancelSaleReturnSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});