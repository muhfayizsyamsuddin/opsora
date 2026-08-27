"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployeeAttendance } from "@/services/attendance.service";

import type {
  AttendanceQueryParams,
} from "@/features/attendances/types/attendance";

export function useEmployeeAttendance(
  employeeId: string,
  params: Omit<
    AttendanceQueryParams,
    "employee_id" | "search" | "date"
  > = {},
) {
  return useQuery({
    queryKey: [
      "attendances",
      "employee",
      employeeId,
      params,
    ],
    queryFn: () =>
      getEmployeeAttendance(
        employeeId,
        params,
      ),
    enabled: Boolean(employeeId),
  });
}