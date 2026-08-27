import { z } from "zod";

export const createRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(100, "Role name must be at most 100 characters."),

  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters.")
    .optional(),

  permissions: z.array(
    z.string().min(1),
  ),
});

export const updateRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters.")
    .max(100, "Role name must be at most 100 characters."),

  description: z
    .string()
    .trim()
    .max(255, "Description must be at most 255 characters.")
    .optional(),
});

export type CreateRoleFormValues =
  z.infer<typeof createRoleFormSchema>;

export type UpdateRoleFormValues =
  z.infer<typeof updateRoleFormSchema>;