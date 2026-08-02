import { z } from "zod";

export const createPayrollSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid(),
    month: z.number().min(1).max(12),
    year: z.number().min(2000).max(3000),
    bonus: z.number().min(0).default(0),
    deduction: z.number().min(0).default(0),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const getPayrollByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getPayrollsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

export const deletePayrollSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});