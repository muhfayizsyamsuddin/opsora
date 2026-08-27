"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadProductImage } from "@/services/product.service";

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

    onError: () => {
      toast.error(
        "Failed to upload product image.",
      );
    },
  });
}