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
import { getApiErrorMessage } from "@/lib/api-error";

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

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Performance review created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create performance review.",
        ),
      );
    },
  });
}