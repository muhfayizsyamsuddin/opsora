"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { completeSaleReturn } from "@/services/sale-return.service";

export function useCompleteSaleReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      completeSaleReturn(id),

    onSuccess: (saleReturn) => {
      queryClient.setQueryData(
        ["sale-returns", saleReturn.id],
        saleReturn,
      );

      queryClient.invalidateQueries({
        queryKey: ["sale-returns"],
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
        "Sale return completed successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to complete sale return.",
      );
    },
  });
}