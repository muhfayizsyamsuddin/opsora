"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSupplier } from "@/services/supplier.service";
import type { UpdateSupplierInput } from "@/features/suppliers/types/supplier";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSupplierInput;
    }) => updateSupplier(id, data),

    onSuccess: (supplier) => {
      queryClient.setQueryData(
        ["suppliers", supplier.id],
        supplier,
      );

      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success(
        "Supplier updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update supplier.",
        ),
      );
    },
  });
}