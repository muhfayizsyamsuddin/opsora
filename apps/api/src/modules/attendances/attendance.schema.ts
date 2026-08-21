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
    page: z.coerce.number().int().min(1).default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),
      
    date: z.coerce.date().optional(),

    search: z.string().optional(),

    employee_id: z.string().uuid().optional(),

    status: z
      .nativeEnum(AttendanceStatus)
      .optional(),

    sort_by: z
      .enum(["checkIn", "createdAt"])
      .default("checkIn"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});

export const getEmployeeAttendanceSchema = z.object({
  body: z.object({}),
  params: z.object({
    employee_id: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    per_page: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20),

    status: z
      .nativeEnum(AttendanceStatus)
      .optional(),

    sort_by: z
      .enum(["checkIn", "createdAt"])
      .default("checkIn"),

    sort_order: z
      .enum(["asc", "desc"])
      .default("desc"),
  }),
});