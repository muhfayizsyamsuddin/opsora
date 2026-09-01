"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { changePassword } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,

    onSuccess() {
      toast.success(
        "Password changed successfully",
      );
    },

    onError(error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to change password",
        ),
      );
    },
  });
}