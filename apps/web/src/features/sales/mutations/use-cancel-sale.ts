"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelSale } from "@/services/sale.service";

export function useCancelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      cancelSale(id),

    onSuccess: (sale) => {
      queryClient.setQueryData(
        ["sales", sale.id],
        sale,
      );

      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      toast.success(
        "Sale cancelled successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to cancel sale.",
      );
    },
  });
}