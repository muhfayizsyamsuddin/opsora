"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";

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
import { RolePermissionsForm } from "@/features/roles/components/role-permissions-form";
import { useRole } from "@/features/roles/queries/use-role";
import { useDeleteRole } from "@/features/roles/mutations/use-delete-role";
import { usePermissions } from "@/hooks/use-permissions";

const SYSTEM_ROLES = new Set([
  "SUPER_ADMIN",
  "OWNER",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CASHIER",
]);

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const role = useRole(id);
  const deleteRole = useDeleteRole();

  const { hasPermission } = usePermissions();
  const canReadPermissions = hasPermission("permissions.read");
  const canReadRole = hasPermission("roles.read");
  const canUpdate = hasPermission("roles.update");
  const canDelete = hasPermission("roles.delete");

  if (role.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-muted" />

        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (role.error || !role.data) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push("/roles")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load role.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The role may not exist or something went wrong.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              role.refetch()
            }
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const data = role.data;

  const isSystemRole =
    SYSTEM_ROLES.has(data.name);

  const handleDelete = () => {
    deleteRole.mutate(
      data.id,
      {
        onSuccess: () => {
          router.push("/roles");
        },
      },
    );
  };

  if (!canReadRole) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 rounded-xl"
            onClick={() =>
              router.push("/roles")
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            Access Control
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Role Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View role information and assigned permissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canUpdate && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  `/roles/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Role
            </Button>
          )}

          {canDelete && !isSystemRole && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteRole.isPending}
              onClick={() =>
                setShowDeleteDialog(true)
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              {deleteRole.isPending
                ? "Deleting..."
                : "Delete Role"}
            </Button>
          )}
        </div>
      </div>

      {/* Role Information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Role Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information for this role.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs text-muted-foreground">
              Name
            </p>

            <p className="mt-1 font-semibold">
              {data.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Type
            </p>

            <div className="mt-1">
              <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {isSystemRole
                  ? "System Role"
                  : "Custom Role"}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">
              Description
            </p>

            <p className="mt-1 text-sm font-medium">
              {data.description ??
                "No description provided."}
            </p>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">
                Permissions
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Permissions currently assigned to this role.
              </p>
            </div>

            <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {data.permissions.length}{" "}
              {data.permissions.length === 1
                ? "permission"
                : "permissions"}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {data.permissions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No permissions assigned.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                This role currently has no system permissions.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {data.permissions.map(
                (permission) => (
                  <div
                    key={permission}
                    className="rounded-xl border bg-muted/20 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                      <p className="break-all text-sm font-medium">
                        {permission}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {canUpdate && canReadPermissions && (
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="border-b px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold">
              Manage Permissions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Add or remove permissions assigned to this role.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <RolePermissionsForm roleId={data.id} />
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Metadata
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Role creation and update information.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/40">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted/40">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatDate(data.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteRole.isPending
          ) {
            setShowDeleteDialog(false);
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
                {data.name}
              </span>
              . This action cannot be undone.
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