"use client";

import { use } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useUser } from "@/features/users/queries/use-user";
import { useUpdateUser } from "@/features/users/mutations/use-update-user";

import type { UpdateUserInput } from "@/features/users/types/user";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const updateUser = useUpdateUser();

  const { hasPermission } = usePermissions();
  const canReadUser = hasPermission("users.read");
  const canUpdateUser = hasPermission("users.update");

  const user = useUser(
    id,
    canReadUser && canUpdateUser,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!user.data) {
      return;
    }

    reset({
      name: user.data.name,
      email: user.data.email,
    });
  }, [user.data, reset]);

  const onSubmit = (
    values: UpdateUserInput,
  ) => {
    updateUser.mutate(
      {
        id,
        data: {
          name: values.name,
          email: values.email,
        },
      },
      {
        onSuccess: () => {
          router.push(`/users/${id}`);
        },
      },
    );
  };

  if (
    !canReadUser ||
    !canUpdateUser
  ) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit users.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
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
    );
  }

  if (user.isLoading) {
    return (
      <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
    );
  }

  if (user.error || !user.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load user.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => user.refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          People Operations
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit User
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update user information and access.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border bg-card shadow-sm"
      >
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            User Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Update the basic information for this user.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Name
            </label>

            <Input
              {...register("name", {
                required: "Name is required.",
              })}
              placeholder="Enter user name"
              className="h-10 rounded-xl"
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Email
            </label>

            <Input
              type="email"
              {...register("email", {
                required: "Email is required.",
              })}
              placeholder="Enter email address"
              className="h-10 rounded-xl"
            />

            {errors.email && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:justify-end sm:p-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={updateUser.isPending}
            onClick={() =>
              router.push(`/users/${id}`)
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="rounded-xl"
            disabled={
              updateUser.isPending ||
              !canUpdateUser
            }
          >
            {updateUser.isPending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}