"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePurchase } from "@/services/purchase.service";

import type {
  UpdatePurchaseInput,
} from "@/features/purchases/types/purchase";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUpdatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePurchaseInput;
    }) => updatePurchase(id, data),

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
        "Purchase updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update purchase.",
        ),
      );
    },
  });
}