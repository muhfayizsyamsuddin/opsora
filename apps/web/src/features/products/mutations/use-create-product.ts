"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProduct } from "@/services/product.service";
import type { CreateProductInput } from "@/features/products/types/product";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        "Product created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create product. Please check the form and try again.",
        ),
      );
    },
  });
}