"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createPayroll } from "@/services/payroll.service";

import type { CreatePayrollInput } from "@/features/payrolls/types/payroll";

export function useCreatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePayrollInput) =>
      createPayroll(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Payroll created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create payroll.",
      );
    },
  });
}