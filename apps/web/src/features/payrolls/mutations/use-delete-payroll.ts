"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePayroll } from "@/services/payroll.service";

export function useDeletePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayroll,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      toast.success(
        "Payroll deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete payroll.",
      );
    },
  });
}