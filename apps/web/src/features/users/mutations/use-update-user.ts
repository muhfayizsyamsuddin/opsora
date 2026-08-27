"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateUser } from "@/services/user.service";

import type { UpdateUserInput } from "@/features/users/types/user";

type UpdateUserVariables = {
  id: string;
  data: UpdateUserInput;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdateUserVariables) =>
      updateUser(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });

      toast.success(
        "User updated successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update user.",
      );
    },
  });
}