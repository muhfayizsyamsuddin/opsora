"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createInventoryAdjustment,
  type CreateInventoryAdjustmentInput,
} from "@/services/inventory.service";

export function useCreateInventoryAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateInventoryAdjustmentInput,
    ) => createInventoryAdjustment(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory", "stock"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory", "movements"],
      });

      toast.success(
        "Inventory adjustment created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create inventory adjustment.",
      );
    },
  });
}