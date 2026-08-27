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

import { useUsers } from "@/features/users/queries/use-users";
import { useDeleteUser } from "@/features/users/mutations/use-delete-user";

import { UserToolbar } from "@/features/users/components/user-toolbar";
import { UserTable } from "@/features/users/components/user-table";
import { UserPagination } from "@/features/users/components/user-pagination";

import type { User } from "@/features/users/types/user";
import type { UserQueryParams } from "@/features/users/types/user";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: UserQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "createdAt",
  sort_order: "desc",
};

export default function UsersPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const [params, setParams] =
    useState<UserQueryParams>(
      DEFAULT_PARAMS,
    );

  const [deleteTarget, setDeleteTarget] =
    useState<User | null>(null);

  const users = useUsers(params);

  const deleteUser = useDeleteUser();

  const data =
    users.data?.data ?? [];

  const meta =
    users.data?.meta;

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    deleteUser.mutate(
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
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Users
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage system users and their access.
          </p>
        </div>

        {hasPermission("users.create") && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/users/new")
            }
          >
            Create User
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <UserToolbar
        params={params}
        onChange={setParams}
      />

      {/* Content */}
      {users.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : users.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load users.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              users.refetch()
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
                ? "user"
                : "users"}
            </p>
          </div>

          <UserTable
            users={data}
            onView={
              hasPermission("users.read")
                ? (user) =>
                    router.push(`/users/${user.id}`)
                : undefined
            }
            onEdit={
              hasPermission("users.update")
                ? (user) =>
                    router.push(`/users/${user.id}/edit`)
                : undefined
            }
            onDelete={
              hasPermission("users.delete")
                ? (user) =>
                    setDeleteTarget(user)
                : undefined
            }
          />

          {meta &&
            meta.total_pages > 0 && (
              <UserPagination
                page={meta.page}
                totalPages={meta.total_pages}
                total={meta.total}
                perPage={meta.per_page}
                onPageChange={(page: number) =>
                  setParams((current) => ({
                    ...current,
                    page,
                  }))
                }
              />
            )}
        </>
      )}

      {/* Deactivate Confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteUser.isPending
          ) {
            setDeleteTarget(null);
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
                {deleteTarget?.name}
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
              onClick={handleDelete}
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