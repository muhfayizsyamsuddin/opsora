import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required"),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required"),

    categoryId: z
      .string()
      .min(1, "Category is required"),

    barcode: z
      .string()
      .trim()
      .max(
        100,
        "Barcode must be at most 100 characters",
      )
      .optional(),

    purchasePrice: z
      .number()
      .finite()
      .min(0, "Purchase price cannot be negative"),

    sellingPrice: z
      .number()
      .finite()
      .min(0, "Selling price cannot be negative"),

    stock: z
      .number()
      .finite()
      .min(0, "Stock cannot be negative"),

    minimumStock: z
      .number()
      .finite()
      .min(0, "Minimum stock cannot be negative"),

    unit: z
      .string()
      .trim()
      .min(1, "Unit is required"),

    status: z.enum([
      "ACTIVE",
      "INACTIVE",
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.sellingPrice < data.purchasePrice) {
      ctx.addIssue({
        code: "custom",
        path: ["sellingPrice"],
        message:
          "Selling price cannot be lower than purchase price",
      });
    }
  });

export type ProductFormValues =
  z.infer<typeof productSchema>;