"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { completePurchase } from "@/services/purchase.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCompletePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      completePurchase(id),

    onSuccess: (purchase) => {
      queryClient.setQueryData(
        ["purchases", purchase.id],
        purchase,
      );

      queryClient.invalidateQueries({
        queryKey: ["purchases"],
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
        "Purchase completed successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to complete purchase.",
        ),
      );
    },
  });
}