"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteEmployee } from "@/services/employee.service";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,

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
        "Employee deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete employee.",
      );
    },
  });
}