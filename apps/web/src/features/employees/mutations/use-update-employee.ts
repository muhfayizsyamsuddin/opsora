"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { updateEmployee } from "@/services/employee.service";

import type {
  Employee,
  UpdateEmployeeInput,
} from "@/features/employees/types/employee";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeInput;
    }) => updateEmployee(id, data),

    onSuccess: (employee: Employee) => {
      queryClient.setQueryData(
        ["employees", employee.id],
        employee,
      );

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success(
        "Employee updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update employee.",
      );
    },
  });
}