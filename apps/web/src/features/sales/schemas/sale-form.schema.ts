import { z } from "zod";

export const saleItemFormSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required"),

  quantity: z
    .number()
    .positive("Quantity must be greater than 0"),

  discount: z
    .number()
    .nonnegative("Discount cannot be negative"),
});

export const saleFormSchema = z.object({
  customerId: z.string().optional(),

  saleDate: z
    .string()
    .min(1, "Sale date is required"),

  paymentMethod: z.enum([
    "CASH",
    "TRANSFER",
    "QRIS",
  ]),

  discount: z
    .number()
    .nonnegative("Discount cannot be negative"),

  items: z
    .array(saleItemFormSchema)
    .min(1, "At least one item is required"),
});

export type SaleFormValues =
  z.infer<typeof saleFormSchema>;