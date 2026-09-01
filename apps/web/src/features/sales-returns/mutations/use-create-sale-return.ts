"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createSaleReturn } from "@/services/sale-return.service";
import type { CreateSaleReturnPayload } from "@/features/sales-returns/types/sale-return";

export function useCreateSaleReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleReturnPayload) =>
      createSaleReturn(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sale-returns"],
      });

      toast.success(
        "Sale return created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create sale return.",
      );
    },
  });
}