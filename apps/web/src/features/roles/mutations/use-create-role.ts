"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createRole } from "@/services/role.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      toast.success(
        "Role created successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create role.",
        ),
      );
    },
  });
}