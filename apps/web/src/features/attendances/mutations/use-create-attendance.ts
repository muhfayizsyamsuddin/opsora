"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { createAttendance } from "@/services/attendance.service";

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      toast.success(
        "Attendance created successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to create attendance.",
      );
    },
  });
}