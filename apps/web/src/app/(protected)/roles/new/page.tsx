"use client";

import { RoleCreateForm } from "@/features/roles/components/role-create-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function CreateRolePage() {
  const { hasPermission } = usePermissions();
  const canCreateRole = hasPermission("roles.create");
  const canReadPermissions = hasPermission("permissions.read");

  if (!canCreateRole || !canReadPermissions) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create roles.
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
          Create Role
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a system role and assign its permissions.
        </p>
      </div>

      <RoleCreateForm />
    </div>
  );
}