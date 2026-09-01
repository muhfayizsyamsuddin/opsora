"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelSaleReturn } from "@/services/sale-return.service";

export function useCancelSaleReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      cancelSaleReturn(id),

    onSuccess: (saleReturn) => {
      queryClient.setQueryData(
        ["sale-returns", saleReturn.id],
        saleReturn,
      );

      queryClient.invalidateQueries({
        queryKey: ["sale-returns"],
      });

      toast.success(
        "Sale return cancelled successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to cancel sale return.",
      );
    },
  });
}