import { z } from "zod";

export const getReportSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    date_from: z.coerce.date().optional(),
    date_to: z.coerce.date().optional(),
  }),
});