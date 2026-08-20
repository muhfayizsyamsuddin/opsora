import { z } from "zod";
import { AttendanceStatus } from "../../generated/prisma/enums.js";

export const createAttendanceSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date().optional(),
    status: z.enum(AttendanceStatus).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updateAttendanceSchema = z.object({
  body: z.object({
    checkOut: z.coerce.date().optional(),
    status: z.enum(AttendanceStatus).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getAttendanceByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}),
});

export const getAttendancesSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
    employeeId: z.string().uuid().optional(),
    status: z.nativeEnum(AttendanceStatus).optional(),
    sort: z.enum(["checkIn", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const getEmployeeAttendanceSchema = z.object({
  body: z.object({}),
  params: z.object({
    employee_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.nativeEnum(AttendanceStatus).optional(),
    sort: z
      .enum(["checkIn", "createdAt"])
      .default("checkIn"),
    order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});