"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { PermissionToolbar } from "@/features/permissions/components/permission-toolbar";
import { PermissionTable } from "@/features/permissions/components/permission-table";
import { PermissionPagination } from "@/features/permissions/components/permission-pagination";
import { usePermissionsQuery } from "@/features/permissions/queries/use-permissions";

import type {
  PermissionQueryParams,
} from "@/features/permissions/types/permission";
import { usePermissions } from "@/hooks/use-permissions";

export default function PermissionsPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadPermissions = hasPermission("permissions.read");

  const [params, setParams] =
    useState<PermissionQueryParams>({
      page: 1,
      per_page: 20,
      sort_by: "name",
      sort_order: "asc",
    });

  const permissions = usePermissionsQuery(
    params,
    canReadPermissions,
  );

  const data =
    permissions.data?.data ?? [];

  const meta =
    permissions.data?.meta;

  if (!canReadPermissions) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Access Control
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Permissions
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View permissions available for role-based
          access control.
        </p>
      </div>

      <PermissionToolbar
        params={params}
        onChange={setParams}
      />

      {permissions.isLoading ? (
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : permissions.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load permissions.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              permissions.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <PermissionTable
            permissions={data}
            onView={(permission) =>
              router.push(
                `/permissions/${permission.id}`,
              )
            }
          />

          {meta && (
            <PermissionPagination
              page={meta.page}
              totalPages={
                meta.total_pages
              }
              total={meta.total}
              onPageChange={(page) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}
        </>
      )}
    </div>
  );
}