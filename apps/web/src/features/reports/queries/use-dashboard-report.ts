"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardReport } from "@/services/report.service";

export function useDashboardReport() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardReport,
  });
}