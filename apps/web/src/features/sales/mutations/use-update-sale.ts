"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSale } from "@/services/sale.service";

import type {
  Sale,
  UpdateSaleInput,
} from "@/features/sales/types/sale";

export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSaleInput;
    }) => updateSale(id, data),

    onSuccess: (sale: Sale) => {
      queryClient.setQueryData(
        ["sales", sale.id],
        sale,
      );

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
        "Sale updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update sale.",
      );
    },
  });
}