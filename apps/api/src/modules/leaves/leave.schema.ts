import { z } from "zod";
import { LeaveStatus } from "../../generated/prisma/enums.js";

export const createLeaveSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    reason: z.string().min(5).max(500),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateLeaveSchema = z.object({
  body: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    reason: z.string().min(5).max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getLeaveByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const approveLeaveSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const cancelLeaveSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getLeavesSchema = z.object({
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

    employee_id: z.string().uuid().optional(),

    status: z
      .nativeEnum(LeaveStatus)
      .optional(),

    start_date: z.coerce.date().optional(),

    end_date: z.coerce.date().optional(),

    sort_by: z
      .enum(["startDate", "endDate", "createdAt"])
      .default("createdAt"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});