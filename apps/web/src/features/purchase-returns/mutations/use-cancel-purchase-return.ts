"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelPurchaseReturn } from "@/services/purchase-return.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCancelPurchaseReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      cancelPurchaseReturn(id),

    onSuccess: (purchaseReturn) => {
      queryClient.setQueryData(
        ["purchase-returns", purchaseReturn.id],
        purchaseReturn,
      );

      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      toast.success(
        "Purchase return cancelled successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to cancel purchase return.",
        ),
      );
    },
  });
}