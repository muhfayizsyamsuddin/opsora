"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createUser } from "@/services/user.service";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        "User created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create user.",
      );
    },
  });
}