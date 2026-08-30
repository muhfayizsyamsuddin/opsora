"use client";

import { useQuery } from "@tanstack/react-query";

import { getLeaves } from "@/services/leave.service";

import type {
  LeaveQueryParams,
} from "@/features/leaves/types/leave";

export function useLeaves(
  params: LeaveQueryParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["leaves", params],
    queryFn: () => getLeaves(params),
    enabled,
  });
}