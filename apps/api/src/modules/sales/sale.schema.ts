import { z } from "zod";

const saleItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  discount: z.coerce.number().nonnegative().default(0),
});

export const createSaleSchema = z.object({
  body: z.object({
    customerId: z.string().uuid().optional(),
    saleDate: z.coerce.date(),
    paymentMethod: z.enum(["CASH", "TRANSFER", "QRIS"]),
    discount: z.coerce.number().nonnegative().default(0),
    items: z.array(saleItemSchema).min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getSalesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export const getSaleByIdSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const cancelSaleSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});