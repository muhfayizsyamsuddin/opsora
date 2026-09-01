"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadProductImage } from "@/services/product.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUploadProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      file,
    }: {
      id: string;
      file: File;
    }) => uploadProductImage(id, file),

    onSuccess: (product) => {
      queryClient.setQueryData(
        ["products", product.id],
        product,
      );

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success(
        "Product image updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to upload product image.",
        ),
      );
    },
  });
}