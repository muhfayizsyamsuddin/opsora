import { z } from "zod";

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    email: z.email(),
    position: z.string().min(2).max(100),
    salary: z.number().positive(),
    hireDate: z.coerce.date(),
    departmentId: z.string().uuid(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.email().optional(),
    position: z.string().min(2).max(100).optional(),
    salary: z.number().positive().optional(),
    hireDate: z.coerce.date().optional(),
    departmentId: z.string().uuid().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getEmployeeByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getEmployeesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    sort: z
      .enum(["name", "salary", "hireDate", "createdAt"])
      .optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});