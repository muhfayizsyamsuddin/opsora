"use client";

import { useQuery } from "@tanstack/react-query";

import { getAttendances } from "@/services/attendance.service";

import type {
  AttendanceQueryParams,
} from "@/features/attendances/types/attendance";

export function useAttendances(
  params: AttendanceQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["attendances", params],
    queryFn: () => getAttendances(params),
    enabled,
  });
}