"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateSettings } from "@/services/setting.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,

    onSuccess: (settings) => {
      queryClient.setQueryData(
        ["settings"],
        settings,
      );

      toast.success(
        "Settings updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update settings.",
        ),
      );
    },
  });
}