"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardReport } from "@/services/report.service";

export function useDashboardReport(
  enabled = true
) {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardReport,
    enabled,
  });
}