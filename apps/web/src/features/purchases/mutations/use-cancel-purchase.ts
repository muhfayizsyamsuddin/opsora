"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelPurchase } from "@/services/purchase.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCancelPurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      cancelPurchase(id),

    onSuccess: (purchase) => {
      queryClient.setQueryData(
        ["purchases", purchase.id],
        purchase,
      );

      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Purchase cancelled successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to cancel purchase.",
        ),
      );
    },
  });
}