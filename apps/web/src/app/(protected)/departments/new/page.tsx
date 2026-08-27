"use client";

import { DepartmentForm } from "@/features/departments/components/DepartmentForm";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewDepartmentPage() {
  const { hasPermission } = usePermissions();
  const canCreateDepartment = hasPermission("departments.create");

  if (!canCreateDepartment) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create departments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Departments
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Department
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new department for your organization.
        </p>
      </div>

      <DepartmentForm />
    </div>
  );
}