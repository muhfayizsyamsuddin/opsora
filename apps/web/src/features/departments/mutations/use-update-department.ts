"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateDepartment } from "@/services/department.service";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string };
    }) => updateDepartment(id, data),

    onSuccess: (department) => {
      queryClient.setQueryData(
        ["departments", department.id],
        department,
      );

      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Department updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update department.",
      );
    },
  });
}