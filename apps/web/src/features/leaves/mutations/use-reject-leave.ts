"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { rejectLeave } from "@/services/leave.service";

import type { Leave } from "@/features/leaves/types/leave";

export function useRejectLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      rejectLeave(id),

    onSuccess: (leave: Leave) => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      queryClient.setQueryData(
        ["leaves", leave.id],
        leave,
      );

      toast.success(
        "Leave request rejected successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to reject leave request.",
      );
    },
  });
}