"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createSale } from "@/services/sale.service";
import type { CreateSaleInput } from "@/features/sales/types/sale";
import { getApiErrorMessage } from "@/lib/api-error";

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

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Sale created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create sale.",
        ),
      );
    },
  });
}