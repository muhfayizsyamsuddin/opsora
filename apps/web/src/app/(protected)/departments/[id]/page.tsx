"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

import { getDepartmentById } from "@/services/department.service";
import { usePermissions } from "@/hooks/use-permissions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadDepartment = hasPermission("departments.read");

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
          Unable to load department.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/departments")
          }
        >
          Back to Departments
        </Button>
      </div>
    );
  }

  const data = department.data;

  if (!canReadDepartment) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this department.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Departments
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Department Detail
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/departments")
            }
          >
            Back to Departments
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push(
                `/departments/${data.id}/edit`,
              )
            }
          >
            Edit
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Department Name
            </p>

            <p className="mt-1 font-semibold">
              {data.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Updated
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.updatedAt)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}