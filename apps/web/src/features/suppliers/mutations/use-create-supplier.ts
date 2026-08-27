"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createSupplier } from "@/services/supplier.service";
import type { CreateSupplierInput } from "@/features/suppliers/types/supplier";

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierInput) =>
      createSupplier(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success(
        "Supplier created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create supplier.",
      );
    },
  });
}