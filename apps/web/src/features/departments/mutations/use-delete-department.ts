"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteDepartment } from "@/services/department.service";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      toast.success(
        "Department deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete department.",
      );
    },
  });
}