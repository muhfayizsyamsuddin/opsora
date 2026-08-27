"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteUser } from "@/services/user.service";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        "User deactivated successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to deactivate user.",
      );
    },
  });
}