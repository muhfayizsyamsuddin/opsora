"use client";

import { useQuery } from "@tanstack/react-query";

import { getLeaveById } from "@/services/leave.service";

export function useLeave(id: string) {
  return useQuery({
    queryKey: ["leaves", id],
    queryFn: () => getLeaveById(id),
    enabled: Boolean(id),
  });
}