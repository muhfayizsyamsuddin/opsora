"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/features/users/queries/use-user-permissions";
import { usePermissions } from "@/hooks/use-permissions";

type UserPermissionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function UserPermissionsPage({
  params,
}: UserPermissionsPageProps) {
  const router = useRouter();

  const { id } = use(params);

  const { hasPermission } = usePermissions();

  const permissions = useUserPermissions(id);

  if (!hasPermission("users.read")) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to view user access details.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => router.push("/users")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  if (permissions.isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            User Permissions
          </h1>
        </div>

        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (permissions.error || !permissions.data) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            User Permissions
          </h1>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold">
            Unable to load permissions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading this users permissions.
          </p>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => permissions.refetch()}
            >
              Try Again
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const data = permissions.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            User Permissions
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            View the effective permissions assigned to this user.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* User / Role */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold">
            Access Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            The role and effective access assigned to this user.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                User ID
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {data.userId}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-muted/40">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Assigned Role
              </p>

              <p className="mt-1 font-medium">
                {data.role ?? "No role assigned"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold">
              Effective Permissions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Permissions currently inherited by this users role.
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {data.permissions.length}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          {data.permissions.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.permissions.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2.5"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <span className="text-sm">
                    {permission}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">
                This user currently has no effective permissions.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}