import { z } from "zod";

export const inventoryAdjustmentSchema =
  z.object({
    product_id: z
      .string()
      .min(1, "Product is required"),

    movement_type: z.enum([
      "IN",
      "OUT",
    ]),

    quantity: z
      .number()
      .positive(
        "Quantity must be greater than 0",
      ),

    reason: z
      .string()
      .trim()
      .min(
        3,
        "Reason must be at least 3 characters",
      )
      .max(
        500,
        "Reason must be at most 500 characters",
      ),
  });

export type InventoryAdjustmentFormValues =
  z.infer<
    typeof inventoryAdjustmentSchema
  >;