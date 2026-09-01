"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePermissions } from "@/hooks/use-permissions";

import { RoleToolbar } from "@/features/roles/components/role-toolbar";
import { RoleTable } from "@/features/roles/components/role-table";
import { RolePagination } from "@/features/roles/components/role-pagination";

import { useRoleList } from "@/features/roles/queries/use-role-list";
import { useDeleteRole } from "@/features/roles/mutations/use-delete-role";

import type {
  Role,
  RoleQueryParams,
} from "@/features/roles/types/role";

const DEFAULT_PARAMS: RoleQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "name",
  sort_order: "asc",
};

export default function RolesPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadRoles = hasPermission("roles.read");
  const canCreateRole = hasPermission("roles.create");
  const canUpdateRole = hasPermission("roles.update");
  const canDeleteRole = hasPermission("roles.delete");

  const [params, setParams] =
    useState<RoleQueryParams>(
      DEFAULT_PARAMS,
    );

  const [deleteTarget, setDeleteTarget] =
    useState<Role | null>(null);

  const roles = useRoleList(
    params,
    canReadRoles,
  );
  const deleteRole = useDeleteRole();

  const data =
    roles.data?.data ?? [];

  const meta =
    roles.data?.meta;

  if (!canReadRoles) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view roles.
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteRole.mutate(
      deleteTarget.id,
      {
        onSuccess: () => {
          setDeleteTarget(null);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Roles
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage system roles and assigned permissions.
          </p>
        </div>

        {canCreateRole && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/roles/new")
            }
          >
            Create Role
          </Button>
        )}
      </div>

      <RoleToolbar
        params={params}
        onChange={setParams}
      />

      {roles.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : roles.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load roles.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              roles.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "role"
                : "roles"}
            </p>
          </div>

          <RoleTable
            roles={data}
            canRead={canReadRoles}
            canUpdate={canUpdateRole}
            canDelete={canDeleteRole}
            onView={(role) =>
              router.push(
                `/roles/${role.id}`,
              )
            }
            onEdit={(role) =>
              router.push(
                `/roles/${role.id}/edit`,
              )
            }
            onDelete={(role) =>
              setDeleteTarget(role)
            }
          />

          {meta &&
            meta.total_pages > 0 && (
              <RolePagination
                page={meta.page}
                totalPages={
                  meta.total_pages
                }
                total={meta.total}
                onPageChange={(page) =>
                  setParams(
                    (current) => ({
                      ...current,
                      page,
                    }),
                  )
                }
              />
            )}
        </>
      )}

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteRole.isPending
          ) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete role?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              . System roles and roles assigned
              to users cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteRole.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteRole.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleteRole.isPending
                ? "Deleting..."
                : "Delete Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}