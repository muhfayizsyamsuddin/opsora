import { z } from "zod";

export const healthSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}),
  params: z.object({}),
});