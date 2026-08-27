import { z } from "zod";

export const purchaseItemFormSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required"),

  quantity: z
    .number()
    .positive("Quantity must be greater than 0"),

  unitPrice: z
    .number()
    .min(0, "Unit price cannot be negative"),
});

export const purchaseFormSchema = z.object({
  supplierId: z
    .string()
    .min(1, "Supplier is required"),

  purchaseDate: z
    .string()
    .min(1, "Purchase date is required"),

  items: z
    .array(purchaseItemFormSchema)
    .min(1, "At least one item is required"),
});

export type PurchaseFormValues =
  z.infer<typeof purchaseFormSchema>;