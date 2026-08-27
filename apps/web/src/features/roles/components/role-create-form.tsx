"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { usePermissionsQuery } from "@/features/permissions/queries/use-permissions";
import { useCreateRole } from "@/features/roles/mutations/use-create-role";

import {
  createRoleFormSchema,
  type CreateRoleFormValues,
} from "@/features/roles/schemas/role-form.schema";

export function RoleCreateForm() {
  const router = useRouter();

  const permissions = usePermissionsQuery({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const createRole = useCreateRole();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(
      createRoleFormSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const selectedPermissions =
    watch("permissions");

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
        shouldValidate: true,
      },
    );
  };

  const onSubmit = (
    values: CreateRoleFormValues,
  ) => {
    createRole.mutate(
      {
        name: values.name,
        description:
          values.description ||
          undefined,
        permissions:
          values.permissions,
      },
      {
        onSuccess: () => {
          router.push("/roles");
        },
      },
    );
  };

  const permissionList =
    permissions.data?.data ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            Role Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Configure the role name and description.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Name
            </label>

            <Input
              {...register("name")}
              placeholder="e.g. HR_MANAGER"
              className="h-10 rounded-xl"
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Description
            </label>

            <Input
              {...register("description")}
              placeholder="Describe this role"
              className="h-10 rounded-xl"
            />

            {errors.description && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            Permissions
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Select permissions assigned to this role.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {permissions.isLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-muted/30" />
          ) : permissions.error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium">
                Unable to load permissions.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={createRole.isPending}
          onClick={() =>
            router.push("/roles")
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={
            createRole.isPending ||
            permissions.isLoading
          }
        >
          {createRole.isPending
            ? "Creating..."
            : "Create Role"}
        </Button>
      </div>
    </form>
  );
}