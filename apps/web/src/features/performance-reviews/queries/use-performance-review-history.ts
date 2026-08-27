"use client";

import { useQuery } from "@tanstack/react-query";

import { getEmployeePerformanceHistory } from "@/services/performance-review.service";

import type { PerformanceReviewQueryParams } from "@/features/performance-reviews/types/performance-review";

export function usePerformanceReviewHistory(
  employeeId: string,
  params?: Omit<
    PerformanceReviewQueryParams,
    "employee_id"
  >,
) {
  return useQuery({
    queryKey: [
      "performance-reviews",
      "employee-history",
      employeeId,
      params,
    ],
    queryFn: () =>
      getEmployeePerformanceHistory(
        employeeId,
        params,
      ),
    enabled: Boolean(employeeId),
  });
}