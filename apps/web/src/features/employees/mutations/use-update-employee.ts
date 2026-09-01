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
import { getApiErrorMessage } from "@/lib/api-error";

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

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Employee updated successfully",
      );
    },

    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "Failed to update employee.",
        ),
      );
    },
  });
}