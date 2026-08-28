"use client";

import { useQuery } from "@tanstack/react-query";

import { getPeopleSummary } from "@/services/dashboard.service";

export function usePeopleSummary(
  enabled = true,
) {
  return useQuery({
    queryKey: ["dashboard", "people-summary"],
    queryFn: getPeopleSummary,
    enabled,
  });
}