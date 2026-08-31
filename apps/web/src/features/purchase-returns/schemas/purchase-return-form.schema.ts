import { z } from "zod";

export const purchaseReturnItemFormSchema =
  z.object({
    purchaseItemId: z
      .string()
      .min(1, "Purchase item is required"),

    quantity: z
      .number()
      .positive(
        "Quantity must be greater than 0",
      ),
  });

export const purchaseReturnFormSchema =
  z.object({
    purchaseId: z
      .string()
      .min(1, "Purchase is required"),

    returnDate: z
      .string()
      .min(1, "Return date is required"),

    reason: z
      .string()
      .trim()
      .optional(),

    items: z
      .array(
        purchaseReturnItemFormSchema,
      )
      .min(
        1,
        "At least one item is required",
      )
      .superRefine((items, ctx) => {
        const seen = new Set<string>();

        items.forEach((item, index) => {
          if (
            seen.has(
              item.purchaseItemId,
            )
          ) {
            ctx.addIssue({
              code: "custom",
              message:
                "This purchase item has already been added",
              path: [
                index,
                "purchaseItemId",
              ],
            });

            return;
          }

          seen.add(
            item.purchaseItemId,
          );
        });
      }),
  });

export type PurchaseReturnFormValues =
  z.infer<
    typeof purchaseReturnFormSchema
  >;