"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSupplier } from "@/services/supplier.service";

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteSupplier(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success(
        "Supplier deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete supplier. Please try again.",
      );
    },
  });
}