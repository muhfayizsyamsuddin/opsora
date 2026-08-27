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

  system: z.object({
    theme: z.enum(["light", "dark"]),

    currency: z
      .string()
      .min(3, "Currency must be at least 3 characters.")
      .max(10, "Currency must be at most 10 characters."),

    dateFormat: z
      .string()
      .min(1, "Date format is required.")
      .max(50, "Date format must be at most 50 characters."),

    timeFormat: z.enum(["12h", "24h"]),
  }),
});

export type SettingsFormValues =
  z.infer<typeof settingsFormSchema>;