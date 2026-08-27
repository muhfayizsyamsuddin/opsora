"use client";

import { useQuery } from "@tanstack/react-query";

import { getPerformanceReport } from "@/services/report.service";

export function usePerformanceReport() {
  return useQuery({
    queryKey: ["reports", "performance"],
    queryFn: getPerformanceReport,
  });
}