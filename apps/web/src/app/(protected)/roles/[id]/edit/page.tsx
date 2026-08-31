"use client";

import { use } from "react";

import { RoleEditForm } from "@/features/roles/components/role-edit-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { hasPermission } = usePermissions();
  const canReadRole = hasPermission("roles.read");
  const canUpdateRole = hasPermission("roles.update");

  if (!canReadRole || !canUpdateRole) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit roles.
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
          Edit Role
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update role information and assigned permissions.
        </p>
      </div>

      <RoleEditForm roleId={id} />
    </div>
  );
}