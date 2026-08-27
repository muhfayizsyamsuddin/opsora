"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createDepartment } from "@/services/department.service";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      toast.success(
        "Department created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create department.",
      );
    },
  });
}