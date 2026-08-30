"use client";

import { useQuery } from "@tanstack/react-query";

import { getAttendanceById } from "@/services/attendance.service";

export function useAttendance(
  id: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["attendances", id],
    queryFn: () => getAttendanceById(id),
    enabled: Boolean(id) && enabled,
  });
}