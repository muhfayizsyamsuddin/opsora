"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createLeave } from "@/services/leave.service";
import { getApiErrorMessage } from "@/lib/api-error";

export function useCreateLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Leave request created successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to create leave request.",
        ),
      );
    },
  });
}