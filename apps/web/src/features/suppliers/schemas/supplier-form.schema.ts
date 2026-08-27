import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Supplier name must be at least 2 characters")
    .max(150, "Supplier name must be at most 150 characters"),

  phone: z
    .string()
    .trim()
    .max(30, "Phone must be at most 30 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(150, "Email must be at most 150 characters")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(500, "Address must be at most 500 characters")
    .optional(),
});

export type SupplierFormValues =
  z.infer<typeof supplierFormSchema>;