"use client";

import { EmployeeForm } from "@/features/employees/components/EmployeeForm";
import { useDepartments } from "@/features/departments/queries/use-departments";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewEmployeePage() {
  const { hasPermission } = usePermissions();
  const canCreateEmployee = hasPermission("employees.create");
  const canReadDepartments = hasPermission("departments.read");
  
  const departments = useDepartments(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canCreateEmployee && canReadDepartments,
  );

  
  if (!canCreateEmployee) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create employees.
        </p>
      </div>
    );
  }

  if (!canReadDepartments) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view departments required to create employees.
        </p>
      </div>
    );
  }

  if (departments.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (departments.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load departments.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
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
          Add Employee
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new employee record.
        </p>
      </div>

      <EmployeeForm
        departments={
          departments.data?.data ?? []
        }
      />
    </div>
  );
}