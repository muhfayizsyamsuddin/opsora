"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRole } from "@/services/role.service";

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

    onError: () => {
      toast.error(
        "Failed to delete role.",
      );
    },
  });
}