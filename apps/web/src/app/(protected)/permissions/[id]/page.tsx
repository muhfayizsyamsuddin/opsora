"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePermission } from "@/features/permissions/queries/use-permission";
import { usePermissions } from "@/hooks/use-permissions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 text-sm font-medium">
        {children}
      </div>
    </div>
  );
}

export default function PermissionDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { hasPermission } = usePermissions();
  const canReadPermission = hasPermission("permissions.read");

  const permission = usePermission(
    params.id,
    canReadPermission,
  );

  if (!canReadPermission) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view permissions.
        </p>
      </div>
    );
  }

  if (permission.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (permission.error || !permission.data) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          className="rounded-xl"
          onClick={() =>
            router.push("/permissions")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Permissions
        </Button>

        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Unable to load permission
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The permission could not be found or an
            error occurred while loading it.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() =>
              permission.refetch()
            }
          >
            Try Again
          </Button>
        </section>
      </div>
    );
  }

  const data = permission.data;

  return (
    <div className="space-y-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-3 rounded-xl"
          onClick={() =>
            router.push("/permissions")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Permissions
        </Button>

        <p className="text-sm font-medium text-muted-foreground">
          Access Control
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Permission Detail
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View access-control permission information.
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/40">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <h2 className="font-semibold">
              {data.name}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              System permission
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DetailItem label="Permission Name">
            <span className="break-all">
              {data.name}
            </span>
          </DetailItem>

          <DetailItem label="Description">
            {data.description ?? "—"}
          </DetailItem>

          <DetailItem label="Created At">
            {formatDate(data.createdAt)}
          </DetailItem>

          <DetailItem label="Last Updated">
            {formatDate(data.updatedAt)}
          </DetailItem>
        </div>
      </section>
    </div>
  );
}