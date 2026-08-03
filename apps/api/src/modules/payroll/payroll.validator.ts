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
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    employeeId: z.string().uuid().optional(),

    month: z.coerce.number().int().min(1).max(12).optional(),

    year: z.coerce.number().int().min(2000).optional(),

    search: z.string().optional(),

    sort: z
      .enum([
        "month",
        "year",
        "baseSalary",
        "bonus",
        "deduction",
        "totalSalary",
        "createdAt",
      ])
      .default("createdAt"),

    order: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export const deletePayrollSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});