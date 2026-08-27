"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createLeave } from "@/services/leave.service";

export function useCreateLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success(
        "Leave request created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create leave request.",
      );
    },
  });
}