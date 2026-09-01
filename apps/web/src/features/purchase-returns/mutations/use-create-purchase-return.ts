"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createPurchaseReturn } from "@/services/purchase-return.service";
import type { CreatePurchaseReturnInput } from "@/features/purchase-returns/types/purchase-return";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCreatePurchaseReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseReturnInput) =>
      createPurchaseReturn(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      toast.success(
        "Purchase return created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create purchase return.",
        ),
      );
    },
  });
}