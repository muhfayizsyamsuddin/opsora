"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createRole } from "@/services/role.service";

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

    onError: () => {
      toast.error(
        "Failed to create role.",
      );
    },
  });
}