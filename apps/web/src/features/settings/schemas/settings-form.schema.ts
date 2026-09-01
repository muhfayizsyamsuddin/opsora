import { z } from "zod";

export const settingsFormSchema = z.object({
  company: z.object({
    name: z
      .string()
      .max(255, "Company name must be at most 255 characters."),

    logo: z
      .string()
      .url("Logo must be a valid URL.")
      .or(z.literal("")),

    phone: z
      .string()
      .max(50, "Phone must be at most 50 characters."),

    email: z
      .string()
      .email("Invalid email address.")
      .or(z.literal("")),

    address: z
      .string()
      .max(500, "Address must be at most 500 characters."),
  }),
});

export type SettingsFormValues =
  z.infer<typeof settingsFormSchema>;