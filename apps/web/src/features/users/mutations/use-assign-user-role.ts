"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { assignUserRole } from "@/services/user.service";

import type { AssignUserRoleInput } from "@/features/users/types/user";

type AssignUserRoleVariables = {
  id: string;
  data: AssignUserRoleInput;
};

export function useAssignUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: AssignUserRoleVariables) =>
      assignUserRole(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "users",
          variables.id,
          "permissions",
        ],
      });

      toast.success(
        "User role updated successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update user role.",
      );
    },
  });
}