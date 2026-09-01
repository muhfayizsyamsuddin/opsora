import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
});

export type UpdateProfileFormValues =
  z.infer<typeof updateProfileSchema>;