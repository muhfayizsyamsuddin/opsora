"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/services/dashboard.service";

export function useDashboardSummary(
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
    enabled,
  });
}