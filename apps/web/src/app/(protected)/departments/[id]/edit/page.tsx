"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { DepartmentForm } from "@/features/departments/components/DepartmentForm";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentById } from "@/services/department.service";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const { hasPermission } = usePermissions();
  const canUpdateDepartment = hasPermission("departments.update");

  const department = useQuery({
    queryKey: ["departments", id],
    queryFn: () => getDepartmentById(id),
  });

  if (department.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-52 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    department.error ||
    !department.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load department editor.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(
              `/departments/${id}`,
            )
          }
        >
          Back to Department
        </Button>
      </div>
    );
  }

  if (!canUpdateDepartment) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit departments.
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
          Edit Department
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update department information.
        </p>
      </div>

      <DepartmentForm
        department={department.data}
      />
    </div>
  );
}