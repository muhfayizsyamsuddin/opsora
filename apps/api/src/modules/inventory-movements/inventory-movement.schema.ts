import { z } from "zod";

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
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const adjustInventorySchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.coerce
      .number()
      .refine((value) => value !== 0, {
        message: "Adjustment quantity cannot be zero",
      }),
    reason: z.string().min(3).max(500),
  }),
  params: z.object({}),
  query: z.object({}),
});