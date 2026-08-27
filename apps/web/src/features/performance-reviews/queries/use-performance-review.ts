import { useQuery } from "@tanstack/react-query";

import {
  getPerformanceReviewById,
} from "@/services/performance-review.service";

export function usePerformanceReview(
  id: string,
) {
  return useQuery({
    queryKey: [
      "performance-reviews",
      id,
    ],
    queryFn: () =>
      getPerformanceReviewById(id),
    enabled: Boolean(id),
  });
}