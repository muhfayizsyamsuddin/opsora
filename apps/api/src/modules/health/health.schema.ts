import { z } from "zod";

export const healthSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({}),
});