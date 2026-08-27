"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCategory } from "@/services/category.service";
import type { UpdateCategoryInput } from "@/features/categories/types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }) => updateCategory(id, data),

    onSuccess: (category) => {
      queryClient.setQueryData(
        ["categories", category.id],
        category,
      );

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success(
        "Category updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update category.",
      );
    },
  });
}