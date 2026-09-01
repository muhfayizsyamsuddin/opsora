"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useChangePassword } from "@/features/auth/mutations/use-change-password";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/change-password.schema";

export function ChangePasswordForm() {
  const changePassword =
    useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(
      changePasswordSchema,
    ),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (
    values: ChangePasswordFormValues,
  ) => {
    changePassword.mutate(
      {
        currentPassword:
          values.currentPassword,
        newPassword:
          values.newPassword,
      },
      {
        onSuccess() {
          reset();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 lg:grid-cols-3"
    >
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Current Password
        </label>

        <Input
          type="password"
          autoComplete="current-password"
          {...register(
            "currentPassword",
          )}
          disabled={
            changePassword.isPending
          }
          className="h-10 rounded-xl"
        />

        {errors.currentPassword && (
          <p className="mt-1.5 text-xs text-destructive">
            {
              errors.currentPassword
                .message
            }
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          New Password
        </label>

        <Input
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          disabled={
            changePassword.isPending
          }
          className="h-10 rounded-xl"
        />

        {errors.newPassword && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Confirm New Password
        </label>

        <Input
          type="password"
          autoComplete="new-password"
          {...register(
            "confirmPassword",
          )}
          disabled={
            changePassword.isPending
          }
          className="h-10 rounded-xl"
        />

        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-destructive">
            {
              errors.confirmPassword
                .message
            }
          </p>
        )}
      </div>

      <div className="flex justify-end lg:col-span-3">
        <Button
          type="submit"
          disabled={
            !isDirty ||
            changePassword.isPending
          }
          className="rounded-xl"
        >
          {changePassword.isPending
            ? "Changing..."
            : "Change Password"}
        </Button>
      </div>
    </form>
  );
}