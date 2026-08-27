"use client";

import { AttendanceForm } from "@/features/attendances/components/AttendanceForm";

import { useEmployees } from "@/features/employees/queries/use-employees";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewAttendancePage() {
  const { hasPermission } = usePermissions();
  const canCreateAttendance = hasPermission("attendances.create");

  const employees =
    useEmployees({
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
      status: "ACTIVE",
    });

  if (employees.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (employees.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load employees.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    );
  }

  if (!canCreateAttendance) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to create attendances.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Attendance
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Add Attendance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new attendance record.
        </p>
      </div>

      <AttendanceForm
        employees={
          employees.data?.data ?? []
        }
      />
    </div>
  );
}