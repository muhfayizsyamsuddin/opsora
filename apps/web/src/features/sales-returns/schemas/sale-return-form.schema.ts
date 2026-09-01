import { z } from "zod";

export const saleReturnFormSchema = z.object({
  saleId: z
    .string()
    .min(1, "Sale is required"),

  returnDate: z
    .string()
    .min(1, "Return date is required"),

  reason: z
    .string()
    .trim()
    .optional(),

  items: z
    .array(
      z.object({
        saleItemId: z
          .string()
          .min(1, "Sale item is required"),

        quantity: z
          .number()
          .positive(
            "Quantity must be greater than 0",
          ),
      }),
    )
    .min(
      1,
      "At least one return item is required",
    ),
});

export type SaleReturnFormValues =
  z.infer<typeof saleReturnFormSchema>;