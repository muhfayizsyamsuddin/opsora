"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateRolePermissions,
} from "@/services/role.service";

import type {
  UpdateRolePermissionsInput,
} from "@/features/roles/types/role";

type UpdateRolePermissionsVariables = {
  id: string;
  data: UpdateRolePermissionsInput;
};

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdateRolePermissionsVariables) =>
      updateRolePermissions(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "roles",
          variables.id,
        ],
      });

      toast.success(
        "Role permissions updated successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update role permissions.",
      );
    },
  });
}