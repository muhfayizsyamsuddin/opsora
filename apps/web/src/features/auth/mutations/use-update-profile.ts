"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { updateProfile } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess(updatedUser) {
      queryClient.setQueryData(
        ["users", "me"],
        updatedUser,
      );

      const currentAuthUser =
        useAuthStore.getState().user;

      if (currentAuthUser) {
        useAuthStore.getState().setUser({
          ...currentAuthUser,
          name: updatedUser.name,
          email: updatedUser.email,
        });
      }

      toast.success(
        "Profile updated successfully",
      );
    },

    onError(error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update profile",
        ),
      );
    },
  });
}