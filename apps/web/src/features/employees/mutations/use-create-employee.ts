"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createEmployee } from "@/services/employee.service";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Employee created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create employee.",
      );
    },
  });
}