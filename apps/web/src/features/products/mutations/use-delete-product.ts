"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProduct } from "@/services/product.service";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        "Product deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete product. Please try again.",
      );
    },
  });
}