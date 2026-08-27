"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { EmployeeForm } from "@/features/employees/components/EmployeeForm";
import { useDepartments } from "@/features/departments/queries/use-departments";

import { getEmployeeById } from "@/services/employee.service";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canUpdateEmployee = hasPermission("employees.update");

  const employee = useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployeeById(id),
  });

  const departments =
    useDepartments({
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    });

  if (
    employee.isLoading ||
    departments.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    employee.error ||
    departments.error ||
    !employee.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load employee editor.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(`/employees/${id}`)
          }
        >
          Back to Employee
        </Button>
      </div>
    );
  }

  if (!canUpdateEmployee) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit employees.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Employees
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Employee
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update employee information and status.
        </p>
      </div>

      <EmployeeForm
        employee={employee.data}
        departments={
          departments.data?.data ?? []
        }
      />
    </div>
  );
}