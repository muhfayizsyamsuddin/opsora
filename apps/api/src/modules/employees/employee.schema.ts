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
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
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
    page: z.coerce.number().int().min(1).default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    search: z.string().optional(),

    department_id: z.string().uuid().optional(),

    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

    sort_by: z
      .enum([
        "name",
        "salary",
        "hireDate",
        "createdAt",
      ])
      .default("createdAt"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});