"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateRole } from "@/services/role.service";

import type {
  UpdateRoleInput,
} from "@/features/roles/types/role";
import { getApiErrorMessage } from "@/lib/api-error";

type UpdateRoleVariables = {
  id: string;
  data: UpdateRoleInput;
};

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdateRoleVariables) =>
      updateRole(id, data),

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
        "Role updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update role.",
        ),
      );
    },
  });
}