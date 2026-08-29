"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { cancelLeave } from "@/services/leave.service";

import type { Leave } from "@/features/leaves/types/leave";

export function useCancelLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      cancelLeave(id),

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
        "Leave request cancelled successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to cancel leave request.",
      );
    },
  });
}