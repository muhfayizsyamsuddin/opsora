"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useAttendance } from "@/features/attendances/queries/use-attendance";
import { usePermissions } from "@/hooks/use-permissions";

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

function getStatusStyle(
  status: string,
) {
  switch (status) {
    case "PRESENT":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "LATE":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "ABSENT":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "LEAVE":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";

    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

export default function AttendanceDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  
  const { hasPermission } = usePermissions();
  const canReadAttendance = hasPermission("attendances.read");

  const attendance =
    useAttendance(id);

  if (attendance.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    attendance.error ||
    !attendance.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load attendance.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(
              "/attendances",
            )
          }
        >
          Back to Attendance
        </Button>
      </div>
    );
  }

  const data = attendance.data;

  if (!canReadAttendance) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Attendance
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Attendance Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review employee attendance information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push(
                "/attendances",
              )
            }
          >
            Back to Attendance
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push(
                `/attendances/${data.id}/edit`,
              )
            }
          >
            Edit
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Employee
            </p>

            <p className="mt-1 font-semibold">
              {data.employee.name}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {
                data.employee
                  .employeeCode
              }
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Department
            </p>

            <p className="mt-1 font-semibold">
              {
                data.employee
                  .department.name
              }
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                data.status,
              )}`}
            >
              {data.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Check In
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(
                data.checkIn,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Check Out
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(
                data.checkOut,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created At
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(
                data.createdAt,
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(
                data.updatedAt,
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}