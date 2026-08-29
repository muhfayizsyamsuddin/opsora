"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deletePerformanceReview,
} from "@/services/performance-review.service";

export function useDeletePerformanceReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => deletePerformanceReview(id),

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
        "Performance review deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete performance review.",
      );
    },
  });
}