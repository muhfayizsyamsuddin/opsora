import { z } from "zod";

export const getInventoryStockSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
  }),
});

export const getInventoryStockByProductSchema = z.object({
  body: z.object({}),
  params: z.object({
    product_id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getInventoryMovementsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    productId: z.string().uuid().optional(),
    movementType: z.enum(["IN", "OUT"]).optional(),
    referenceType: z
      .enum(["PURCHASE", "SALE", "ADJUSTMENT"])
      .optional(),
  }),
});