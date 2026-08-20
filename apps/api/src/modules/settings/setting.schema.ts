import { z } from "zod";

export const getSettingsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    company: z
      .strictObject({
        name: z.string().max(255).optional(),
        logo: z.string().url().or(z.literal("")).optional(),
        phone: z.string().max(50).optional(),
        email: z.email().or(z.literal("")).optional(),
        address: z.string().max(500).optional(),
      })
      .optional(),

    system: z
      .strictObject({
        theme: z.enum(["light", "dark"]).optional(),
        currency: z.string().min(3).max(10).optional(),
        dateFormat: z.string().min(1).max(50).optional(),
        timeFormat: z.enum(["12h", "24h"]).optional(),
      })
      .optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});