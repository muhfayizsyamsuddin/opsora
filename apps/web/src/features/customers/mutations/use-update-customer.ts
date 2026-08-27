"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateCustomer } from "@/services/customer.service";
import type { UpdateCustomerInput } from "@/features/customers/types/customer";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerInput;
    }) => updateCustomer(id, data),

    onSuccess: (customer) => {
      queryClient.setQueryData(
        ["customers", customer.id],
        customer,
      );

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success(
        "Customer updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update customer.",
      );
    },
  });
}