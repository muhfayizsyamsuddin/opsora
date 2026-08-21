import { z } from "zod";

export const getInventoryStockSchema = z.object({
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

    search: z.string().optional(),

    sort_by: z
      .enum(["name", "createdAt"])
      .default("name"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("asc"),
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

export const getInventoryMovementByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const createInventoryAdjustmentSchema = z.object({
  body: z.object({
    product_id: z.string().uuid(),
    movement_type: z.enum(["IN", "OUT"]),
    quantity: z.coerce.number().positive(),
    reason: z.string().min(3).max(500),
  }),
  params: z.object({}),
  query: z.object({}),
});