"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRole } from "@/services/role.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

       queryClient.removeQueries({
        queryKey: ["roles", id],
      });

      toast.success(
        "Role deleted successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to delete role.",
        ),
      );
    },
  });
}