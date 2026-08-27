"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCreateAttendance } from "@/features/attendances/mutations/use-create-attendance";
import { useUpdateAttendance } from "@/features/attendances/mutations/use-update-attendance";

import {
  attendanceFormSchema,
  type AttendanceFormValues,
} from "@/features/attendances/schemas/attendance-form.schema";

import type { Employee } from "@/features/employees/types/employee";

import type {
  Attendance,
} from "@/features/attendances/types/attendance";

type AttendanceFormProps = {
  employees: Employee[];
  attendance?: Attendance;
};

function toDateTimeLocal(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000,
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export function AttendanceForm({
  employees,
  attendance,
}: AttendanceFormProps) {
  const router = useRouter();

  const createAttendance =
    useCreateAttendance();

  const updateAttendance =
    useUpdateAttendance();

  const isEditMode =
    Boolean(attendance);

  const isPending =
    createAttendance.isPending ||
    updateAttendance.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } =
    useForm<AttendanceFormValues>({
      resolver: zodResolver(
        attendanceFormSchema,
      ),

      defaultValues: {
        employeeId:
          attendance?.employeeId ?? "",

        checkIn:
          toDateTimeLocal(
            attendance?.checkIn,
          ),

        checkOut:
          toDateTimeLocal(
            attendance?.checkOut,
          ),

        status:
          attendance?.status ??
          "PRESENT",
      },
    });

  const onSubmit = (
    values: AttendanceFormValues,
  ) => {
    if (attendance) {
      updateAttendance.mutate(
        {
          id: attendance.id,
          data: {
            checkOut:
              values.checkOut ||
              undefined,

            status: values.status,
          },
        },
        {
          onSuccess: () => {
            router.replace(
              `/attendances/${attendance.id}`,
            );
          },
        },
      );

      return;
    }

    createAttendance.mutate(
      {
        employeeId:
          values.employeeId,

        checkIn: new Date(
          values.checkIn,
        ).toISOString(),

        checkOut:
          values.checkOut
            ? new Date(
                values.checkOut,
              ).toISOString()
            : undefined,

        status: values.status,
      },
      {
        onSuccess: () => {
          router.replace(
            "/attendances",
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

          <h2 className="mt-1 text-base font-semibold">
            Attendance Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Update attendance check out and status."
              : "Create a new attendance record."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {!isEditMode && (
            <Field
              label="Employee"
              error={
                errors.employeeId
                  ?.message
              }
            >
              <select
                {...register(
                  "employeeId",
                )}
                disabled={isPending}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
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
                      {
                        employee.name
                      }{" "}
                      —{" "}
                      {
                        employee.employeeCode
                      }
                    </option>
                  ),
                )}
              </select>
            </Field>
          )}

          {!isEditMode && (
            <Field
              label="Check In"
              error={
                errors.checkIn
                  ?.message
              }
            >
              <Input
                {...register(
                  "checkIn",
                )}
                type="datetime-local"
                disabled={isPending}
                className="h-10 rounded-xl"
              />
            </Field>
          )}

          <Field
            label="Check Out"
            error={
              errors.checkOut
                ?.message
            }
          >
            <Input
              {...register(
                "checkOut",
              )}
              type="datetime-local"
              disabled={isPending}
              className="h-10 rounded-xl"
            />
          </Field>

          <Field
            label="Status"
            error={
              errors.status?.message
            }
          >
            <select
              {...register("status")}
              disabled={isPending}
              className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
            >
              <option value="PRESENT">
                Present
              </option>

              <option value="LATE">
                Late
              </option>

              <option value="ABSENT">
                Absent
              </option>

              <option value="LEAVE">
                Leave
              </option>
            </select>
          </Field>
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
              attendance
                ? `/attendances/${attendance.id}`
                : "/attendances",
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
              ? "Update Attendance"
              : "Save Attendance"}
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
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}