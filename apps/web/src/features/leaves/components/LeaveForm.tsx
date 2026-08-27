"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateLeave } from "@/features/leaves/mutations/use-create-leave";
import { useUpdateLeave } from "@/features/leaves/mutations/use-update-leave";

import {
  leaveFormSchema,
  type LeaveFormValues,
} from "@/features/leaves/schemas/leave-form.schema";

import type { Employee } from "@/features/employees/types/employee";
import type { Leave } from "@/features/leaves/types/leave";

type LeaveFormProps = {
  employees: Employee[];
  leave?: Leave;
};

export function LeaveForm({
  employees,
  leave,
}: LeaveFormProps) {
  const router = useRouter();

  const createLeave = useCreateLeave();
  const updateLeave = useUpdateLeave();

  const isEditMode = Boolean(leave);

  const isPending =
    createLeave.isPending ||
    updateLeave.isPending;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(
      leaveFormSchema,
    ),
    defaultValues: {
      employeeId:
        leave?.employeeId ?? "",
      startDate: leave?.startDate
        ? leave.startDate.slice(0, 10)
        : "",
      endDate: leave?.endDate
        ? leave.endDate.slice(0, 10)
        : "",
      reason: leave?.reason ?? "",
    },
  });

  useEffect(() => {
    if (!leave) {
      return;
    }

    reset({
      employeeId: leave.employeeId,
      startDate:
        leave.startDate.slice(0, 10),
      endDate:
        leave.endDate.slice(0, 10),
      reason: leave.reason,
    });
  }, [leave, reset]);

  const onSubmit = (
    values: LeaveFormValues,
  ) => {
    if (leave) {
      updateLeave.mutate(
        {
          id: leave.id,
          data: {
            startDate:
              values.startDate,
            endDate:
              values.endDate,
            reason:
              values.reason,
          },
        },
        {
          onSuccess: () => {
            router.replace(
              `/leave-requests/${leave.id}`,
            );
          },
        },
      );

      return;
    }

    createLeave.mutate(
      {
        employeeId:
          values.employeeId,
        startDate:
          values.startDate,
        endDate:
          values.endDate,
        reason:
          values.reason,
      },
      {
        onSuccess: () => {
          router.replace(
            "/leave-requests",
          );
        },
      },
    );
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
            Leave Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update employee leave request information."
              : "Create a new employee leave request."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2"> 
            <Field 
              label="Employee" 
              error={ 
                !isEditMode 
                  ? errors.employeeId?.message 
                  : undefined 
              } 
            > 
              {isEditMode ? (
                <div className="flex h-10 items-center rounded-xl border bg-muted/30 px-3 text-sm text-muted-foreground"> 
                  {leave?.employee.name} —{" "} 
                  {leave?.employee.employeeCode} 
                </div> 
              ) : ( 
                <select 
                  {...register("employeeId")} 
                  disabled={isPending} 
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring" 
                > 
                  <option value=""> 
                    Select employee 
                  </option> 
                  
                  {employees.map( 
                    (employee) => ( 
                      <option 
                        key={employee.id} 
                        value={employee.id} 
                      > 
                        {employee.name} —{" "} 
                        {employee.employeeCode} 
                      </option> 
                    ), 
                  )}
                </select> 
              )} 
            </Field> 
          </div>

          <Field
            label="Start Date"
            error={
              errors.startDate?.message
            }
          >
            <Input
              {...register("startDate")}
              type="date"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="End Date"
            error={
              errors.endDate?.message
            }
          >
            <Input
              {...register("endDate")}
              type="date"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Reason"
              error={
                errors.reason?.message
              }
            >
              <textarea
                {...register("reason")}
                disabled={isPending}
                placeholder="Enter the reason for leave..."
                rows={5}
                className="w-full resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
        {isEditMode
          ? `Leave request status: ${leave?.status}`
          : "Leave request will be created with PENDING status."}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          disabled={isPending}
          onClick={() =>
            router.push(
              leave
                ? `/leave-requests/${leave.id}`
                : "/leave-requests",
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
              ? "Update Leave"
              : "Save Leave"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {children}

      {error && (
        <p className="text-xs leading-5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}