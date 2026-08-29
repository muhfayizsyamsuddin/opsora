"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelPurchase } from "@/services/purchase.service";

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

    onError: () => {
      toast.error(
        "Failed to cancel purchase.",
      );
    },
  });
}