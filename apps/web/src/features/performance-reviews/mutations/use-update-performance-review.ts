"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updatePerformanceReview,
} from "@/services/performance-review.service";

import type {
  UpdatePerformanceReviewInput,
} from "@/features/performance-reviews/types/performance-review";

type UpdatePerformanceReviewMutationInput = {
  id: string;
  data: UpdatePerformanceReviewInput;
};

export function useUpdatePerformanceReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdatePerformanceReviewMutationInput) =>
      updatePerformanceReview(id, data),

    onSuccess: (_, variables) => {
      // Invalidate semua query list performance reviews,
      // termasuk yang memakai params/filter berbeda.
      queryClient.invalidateQueries({
        queryKey: ["performance-reviews"],
      });

      // Invalidate detail review yang baru di-update.
      queryClient.invalidateQueries({
        queryKey: [
          "performance-reviews",
          variables.id,
        ],
      });

      toast.success(
        "Performance review updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update performance review.",
      );
    },
  });
}