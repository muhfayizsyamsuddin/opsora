"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { paySale } from "@/services/sale.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function usePaySale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      paySale(id),

    onSuccess: (sale) => {
      queryClient.setQueryData(
        ["sales", sale.id],
        sale,
      );

      queryClient.invalidateQueries({
        queryKey: ["sales"],
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
        "Sale paid successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to pay sale.",
        ),
      );
    },
  });
}