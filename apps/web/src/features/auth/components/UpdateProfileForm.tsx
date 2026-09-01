"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/features/auth/mutations/use-update-profile";

import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/features/auth/schemas/update-profile.schema";

type UpdateProfileFormProps = {
  name: string;
  email: string;
};

export function UpdateProfileForm({
  name,
  email,
}: UpdateProfileFormProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(
      updateProfileSchema,
    ),
    defaultValues: {
      name,
      email,
    },
  });

  useEffect(() => {
    reset({
      name,
      email,
    });
  }, [name, email, reset]);

  const onSubmit = (
    values: UpdateProfileFormValues,
  ) => {
    updateProfile.mutate(values, {
      onSuccess(updatedUser) {
        reset({
          name: updatedUser.name,
          email: updatedUser.email,
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Name
        </label>

        <Input
          {...register("name")}
          disabled={updateProfile.isPending}
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
          Email
        </label>

        <Input
          type="email"
          {...register("email")}
          disabled={updateProfile.isPending}
          className="h-10 rounded-xl"
        />

        {errors.email && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            !isDirty ||
            updateProfile.isPending
          }
          className="rounded-xl"
        >
          {updateProfile.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}