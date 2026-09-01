"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createCategory } from "@/services/category.service";
import type { CreateCategoryInput } from "@/features/categories/types/category";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success(
        "Category created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create category.",
        ),
      );
    },
  });
}