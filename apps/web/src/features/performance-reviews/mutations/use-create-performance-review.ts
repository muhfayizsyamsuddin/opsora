"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createPerformanceReview } from "@/services/performance-review.service";

import type {
  CreatePerformanceReviewInput,
} from "@/features/performance-reviews/types/performance-review";

export function useCreatePerformanceReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreatePerformanceReviewInput,
    ) => createPerformanceReview(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["performance-reviews"],
      });

      toast.success(
        "Performance review created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create performance review.",
      );
    },
  });
}