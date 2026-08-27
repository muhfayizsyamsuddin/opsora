"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { approveLeave } from "@/services/leave.service";

import type { Leave } from "@/features/leaves/types/leave";

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      approveLeave(id),

    onSuccess: (leave: Leave) => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      queryClient.setQueryData(
        ["leaves", leave.id],
        leave,
      );

      toast.success(
        "Leave request approved successfully.",
      );
    },

    onError: () => {
      toast.error(
        "Failed to approve leave request.",
      );
    },
  });
}