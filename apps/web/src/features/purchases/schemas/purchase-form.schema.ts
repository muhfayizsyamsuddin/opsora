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
    .min(1, "At least one item is required")
    .superRefine((items, ctx) => {
      const seen = new Set<string>();

      items.forEach((item, index) => {
        if (seen.has(item.productId)) {
          ctx.addIssue({
            code: "custom",
            message:
              "This product has already been added",
            path: [index, "productId"],
          });

          return;
        }

        seen.add(item.productId);
      });
    }),
});

export type PurchaseFormValues =
  z.infer<typeof purchaseFormSchema>;