"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateLeave } from "@/services/leave.service";

import type {
  Leave,
  UpdateLeaveInput,
} from "@/features/leaves/types/leave";
import { getApiErrorMessage } from "@/lib/api-error";

type UpdateLeaveMutationInput = {
  id: string;
  data: UpdateLeaveInput;
};

export function useUpdateLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdateLeaveMutationInput) =>
      updateLeave(id, data),

    onSuccess: (leave: Leave) => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      queryClient.setQueryData(
        ["leaves", leave.id],
        leave,
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Leave request updated successfully.",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update leave request.",
        ),
      );
    },
  });
}