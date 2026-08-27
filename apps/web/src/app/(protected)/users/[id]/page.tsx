"use client";

import { use, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";

import { useUser } from "@/features/users/queries/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import { useDeleteUser } from "@/features/users/mutations/use-delete-user";
import { useAssignUserRole } from "@/features/users/mutations/use-assign-user-role";
import { useRoles } from "@/features/roles/queries/use-roles";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserDetailPage({
  params,
}: UserDetailPageProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const router = useRouter();
  const deleteUser = useDeleteUser();
  const roles = useRoles();
  const assignUserRole = useAssignUserRole();
  
  const { hasPermission } = usePermissions();
  const canReadUser = hasPermission("users.read");
  const canDeleteUser = hasPermission("users.delete");
  const canUpdateUser = hasPermission("users.update");
  
  const { id } = use(params);
  
  const user = useUser(id);

  useEffect(() => {
    setSelectedRoleId(user.data?.roleId ?? "");
  }, [user.data?.roleId]);

  if (user.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />

        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (user.error || !user.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load user.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          The user may not exist or something went wrong.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => {
            user.refetch();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const data = user.data;

  const handleDeactivate = () => {
    deleteUser.mutate(data.id, {
      onSuccess: () => {
        router.push("/users");
      },
    });
  };

  const handleAssignRole = () => {
    if (!selectedRoleId) return;

    assignUserRole.mutate({
      id: data.id,
      data: {
        roleId: selectedRoleId,
      },
    });
  };

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  if (!canReadUser) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this user.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            User Details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View user information and access details.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {hasPermission("users.read") && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  `/users/${data.id}/permissions`,
                )
              }
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Permissions
            </Button>
          )}

          {canUpdateUser && (
            <Button
              type="button"
              className="rounded-xl"
              onClick={() =>
                router.push(`/users/${data.id}/edit`)
              }
            >
              Edit User
            </Button>
          )}
          {canDeleteUser && (
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={deleteUser.isPending}
              onClick={() => setShowDeactivateDialog(true)}
            >
              {deleteUser.isPending
                ? "Deactivating..."
                : "Deactivate User"}
            </Button>
          )}
        </div>
      </div>

      {/* User Information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            User Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Basic information about this system user.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {data.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 break-all font-medium">
                {data.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Role
              </p>

              <div className="mt-1">
                {data.role ? (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {data.role}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No role assigned
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <div className="mt-1">
                <span
                  className={
                    data.isActive === false
                      ? "inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                      : "inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600"
                  }
                >
                  {data.isActive === false
                    ? "Inactive"
                    : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Account Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Account creation and update information.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
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

      {/* Role & Permissions */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Roles & Permissions
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Assign or change this users system role.
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Current Role
            </label>

            <div className="rounded-xl border bg-muted/20 px-4 py-3">
              <p className="font-medium">
                {data.role ?? "No role assigned"}
              </p>
            </div>
          </div>

          {canUpdateUser && (
            <>
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Change Role
                </label>

                <select
                  value={selectedRoleId}
                  onChange={(e) =>
                    setSelectedRoleId(e.target.value)
                  }
                  disabled={
                    roles.isLoading ||
                    assignUserRole.isPending
                  }
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-foreground/20 focus:ring-2 focus:ring-ring disabled:opacity-60"
                >
                  <option value="">
                    Select role
                  </option>

                  {roles.data?.data.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>

                {roles.error && (
                  <p className="mt-2 text-xs text-destructive">
                    Failed to load roles.
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  className="rounded-xl"
                  disabled={
                    assignUserRole.isPending ||
                    selectedRoleId === data.roleId
                  }
                  onClick={handleAssignRole}
                >
                  {assignUserRole.isPending
                    ? "Updating Role..."
                    : "Update Role"}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      <AlertDialog
        open={showDeactivateDialog}
        onOpenChange={(open) => {
          if (!open && !deleteUser.isPending) {
            setShowDeactivateDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deactivate user?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will deactivate{" "}
              <span className="font-medium text-foreground">
                {data.name}
              </span>
              . The user will no longer appear in
              the active users list.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteUser.isPending}
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteUser.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeactivate}
            >
              {deleteUser.isPending
                ? "Deactivating..."
                : "Deactivate User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}