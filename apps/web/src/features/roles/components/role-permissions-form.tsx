"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { usePermissionsQuery } from "@/features/permissions/queries/use-permissions";
import { useRole } from "@/features/roles/queries/use-role";
import { useUpdateRolePermissions } from "@/features/roles/mutations/use-update-role-permissions";

type RolePermissionsFormValues = {
  permissions: string[];
};

export function RolePermissionsForm({
  roleId,
}: {
  roleId: string;
}) {
  const { hasPermission } = usePermissions();
  const canReadRole = hasPermission("roles.read");
  const canUpdateRole = hasPermission("roles.update");
  const canReadPermissions = hasPermission("permissions.read");
  
  const canManagePermissions =
  canReadRole &&
  canUpdateRole &&
  canReadPermissions;
  
  const role = useRole(
    roleId,
    canManagePermissions,
  );

  const permissions = usePermissionsQuery(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canManagePermissions,
  );

  const updatePermissions =
    useUpdateRolePermissions();

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<RolePermissionsFormValues>({
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    if (!role.data) {
      return;
    }

    reset({
      permissions: role.data.permissions,
    });
  }, [role.data, reset]);

  const selectedPermissions = useWatch({
    control,
    name: "permissions",
  });

  const togglePermission = (
    permissionName: string,
  ) => {
    const exists =
      selectedPermissions.includes(
        permissionName,
      );

    setValue(
      "permissions",
      exists
        ? selectedPermissions.filter(
            (item) =>
              item !== permissionName,
          )
        : [
            ...selectedPermissions,
            permissionName,
          ],
      {
        shouldDirty: true,
      },
    );
  };

  const onSubmit = (
    values: RolePermissionsFormValues,
  ) => {
    updatePermissions.mutate(
      {
        id: roleId,
        data: {
          permissions:
            values.permissions,
        },
      },
      {
        onSuccess: (updatedRole) => {
          reset({
            permissions:
              updatedRole.permissions,
          });
        },
      },
    );
  };

  if (!canManagePermissions) {
    return null;
  }

  if (
    role.isLoading ||
    permissions.isLoading
  ) {
    return (
      <div className="h-40 animate-pulse rounded-xl bg-muted/30" />
    );
  }

  if (
    role.error ||
    permissions.error ||
    !role.data
  ) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm font-medium">
          Unable to load role permissions.
        </p>
      </div>
    );
  }

  const permissionList =
    permissions.data?.data ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {permissionList.map(
          (permission) => {
            const checked =
              selectedPermissions.includes(
                permission.name,
              );

            return (
              <label
                key={permission.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    togglePermission(
                      permission.name,
                    )
                  }
                  className="mt-0.5 h-4 w-4"
                />

                <div className="min-w-0">
                  <p className="break-all text-sm font-medium">
                    {permission.name}
                  </p>

                  {permission.description && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {permission.description}
                    </p>
                  )}
                </div>
              </label>
            );
          },
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded-xl"
          disabled={
            updatePermissions.isPending ||
            !isDirty
          }
        >
          {updatePermissions.isPending
            ? "Saving..."
            : "Save Permissions"}
        </Button>
      </div>
    </form>
  );
}