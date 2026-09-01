"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { completePurchaseReturn } from "@/services/purchase-return.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCompletePurchaseReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      completePurchaseReturn(id),

    onSuccess: (purchaseReturn) => {
      queryClient.setQueryData(
        ["purchase-returns", purchaseReturn.id],
        purchaseReturn,
      );

      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory", "stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory", "movements"],
      });

      toast.success(
        "Purchase return completed successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to complete purchase return.",
        ),
      );
    },
  });
}