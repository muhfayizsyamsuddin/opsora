"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRole } from "@/features/roles/queries/use-role";
import { useUpdateRole } from "@/features/roles/mutations/use-update-role";

import {
  updateRoleFormSchema,
  type UpdateRoleFormValues,
} from "@/features/roles/schemas/role-form.schema";

export function RoleEditForm({
  roleId,
}: {
  roleId: string;
}) {
  const router = useRouter();

  const role = useRole(roleId);
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(
      updateRoleFormSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!role.data) {
      return;
    }

    reset({
      name: role.data.name,
      description:
        role.data.description ?? "",
    });
  }, [role.data, reset]);

  const onSubmit = (
    values: UpdateRoleFormValues,
  ) => {
    updateRole.mutate(
      {
        id: roleId,
        data: {
          name: values.name,
          description:
            values.description ||
            undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(
            `/roles/${roleId}`,
          );
        },
      },
    );
  };

  if (role.isLoading) {
    return (
      <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
    );
  }

  if (role.error || !role.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load role.
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
    );
  }

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
            Update the role name and description.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Name
            </label>

            <Input
              {...register("name")}
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={updateRole.isPending}
          onClick={() =>
            router.push(
              `/roles/${roleId}`,
            )
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={updateRole.isPending}
        >
          {updateRole.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}