"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteCustomer } from "@/services/customer.service";

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteCustomer(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success(
        "Customer deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete customer. Please try again.",
      );
    },
  });
}