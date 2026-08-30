import { useQuery } from "@tanstack/react-query";

import {
  getPerformanceReviews,
} from "@/services/performance-review.service";

import type {
  PerformanceReviewQueryParams,
} from "@/features/performance-reviews/types/performance-review";

export function usePerformanceReviews(
  params?: PerformanceReviewQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "performance-reviews",
      params,
    ],
    queryFn: () =>
      getPerformanceReviews(params),
    enabled,
  });
}