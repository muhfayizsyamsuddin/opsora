"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateUser } from "@/features/users/mutations/use-create-user";

import type {
  CreateUserInput,
} from "@/features/users/types/user";
import { useRoles } from "@/features/roles/queries/use-roles";
import { usePermissions } from "@/hooks/use-permissions";

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();
  const roles = useRoles();
  
  const { hasPermission } = usePermissions();
  const canCreateUser = hasPermission("users.create");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
    },
  });

  const onSubmit = (
    values: CreateUserInput,
  ) => {
    createUser.mutate(values, {
      onSuccess: () => {
        router.push("/users");
      },
    });
  };

  if (!canCreateUser) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          People Operations
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Create User
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new system user and assign access.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border bg-card shadow-sm"
      >
        <div className="border-b p-5 sm:p-6">
          <h2 className="text-sm font-semibold">
            User Information
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Enter the basic information for this user.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Name
            </label>

            <Input
              {...register("name", {
                required: "Name is required",
              })}
              placeholder="Enter user name"
              className="h-10 rounded-xl"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Email
            </label>

            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="Enter email"
              className="h-10 rounded-xl"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Password
            </label>

            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message:
                    "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter password"
              className="h-10 rounded-xl"
            />

            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Role
            </label>

            <select
              {...register("roleId", {
                required: "Role is required",
              })}
              disabled={roles.isLoading || createUser.isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-foreground/20 focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {roles.isLoading
                  ? "Loading roles..."
                  : "Select role"}
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

            {errors.roleId && (
              <p className="mt-1 text-xs text-destructive">
                {errors.roleId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-5 sm:p-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => router.push("/users")}
            disabled={createUser.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="rounded-xl"
            disabled={createUser.isPending}
          >
            {createUser.isPending
              ? "Creating..."
              : "Create User"}
          </Button>
        </div>
      </form>
    </div>
  );
}