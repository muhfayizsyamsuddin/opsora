"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { updateAttendance } from "@/services/attendance.service";

import type {
  Attendance,
} from "@/features/attendances/types/attendance";

import type {
  UpdateAttendanceInput,
} from "@/features/attendances/types/attendance";

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAttendanceInput;
    }) =>
      updateAttendance(id, data),

    onSuccess: (
      attendance: Attendance,
    ) => {
      queryClient.setQueryData(
        ["attendances", attendance.id],
        attendance,
      );

      queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      toast.success(
        "Attendance updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update attendance.",
      );
    },
  });
}