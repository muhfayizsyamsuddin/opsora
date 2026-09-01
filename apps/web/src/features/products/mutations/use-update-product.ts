"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "@/services/product.service";
import type { UpdateProductInput } from "@/features/products/types/product";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductInput;
    }) => updateProduct(id, data),

    onSuccess: (product) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.setQueryData(
        ["products", product.id],
        product,
      );

      toast.success(
        "Product updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update product. Please check the form and try again.",
        ),
      );
    },
  });
}