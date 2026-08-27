"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateDepartment } from "@/features/departments/mutations/use-create-department";

import {
  departmentFormSchema,
  type DepartmentFormValues,
} from "@/features/departments/schemas/department-form.schema";
import { useUpdateDepartment } from "@/features/departments/mutations/use-update-department";
import type { Department } from "@/features/departments/types/department";
type DepartmentFormProps = {
  department?: Department;
};

export function DepartmentForm({
  department,
}: DepartmentFormProps) {
  const router = useRouter();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();

  const isEditMode = Boolean(department);

  const isPending =
    createDepartment.isPending ||
    updateDepartment.isPending;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(
        departmentFormSchema,
    ),
    defaultValues: {
        name: department?.name ?? "",
    },
  });

  useEffect(() => {
    if (!department) {
      return;
    }

    reset({
      name: department.name,
    });
  }, [department, reset]);

  const onSubmit = (
    values: DepartmentFormValues,
  ) => {
    if (department) {
      updateDepartment.mutate(
        {
          id: department.id,
          data: values,
        },
        {
          onSuccess: () => {
            router.replace(
              `/departments/${department.id}`,
            );
          },
        },
      );
      return;
    }

    createDepartment.mutate(values, {
        onSuccess: () => {
        router.replace("/departments");
        },
    });
    };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            People Operations
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight">
            Department Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update department information."
              : "Create a department for organizing employees."}
          </p>
        </div>

        <div className="max-w-xl space-y-2">
          <Label htmlFor="department-name">
            Department Name
          </Label>

          <Input
            id="department-name"
            {...register("name")}
            placeholder="e.g. Human Resources"
            disabled={isPending}
            className="h-10 rounded-xl"
          />

          {errors.name?.message && (
            <p className="text-xs leading-5 text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending}
          onClick={() =>
            router.push(
              department
                ? `/departments/${department.id}`
                : "/departments",
              )
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={isPending}
        >
          {isPending
            ? isEditMode
            ? "Updating..."
            : "Saving..."
            : isEditMode
            ? "Update Department"
            : "Save Department"}
        </Button>
      </div>
    </form>
  );
}