"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createCustomer } from "@/services/customer.service";
import type { CreateCustomerInput } from "@/features/customers/types/customer";

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInput) =>
      createCustomer(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success(
        "Customer created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create customer.",
      );
    },
  });
}