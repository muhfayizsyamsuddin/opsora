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
    status: z.nativeEnum(LeaveStatus).optional(),
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