"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createPurchase } from "@/services/purchase.service";
import type { CreatePurchaseInput } from "@/features/purchases/types/purchase";

export function useCreatePurchase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseInput) =>
      createPurchase(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success(
        "Purchase created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create purchase.",
      );
    },
  });
}