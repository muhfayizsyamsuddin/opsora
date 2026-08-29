"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createSale } from "@/services/sale.service";
import type { CreateSaleInput } from "@/features/sales/types/sale";

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleInput) =>
      createSale(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success(
        "Sale created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create sale.",
      );
    },
  });
}