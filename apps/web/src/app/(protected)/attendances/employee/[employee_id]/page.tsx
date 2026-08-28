"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AttendancePagination } from "@/features/attendances/components/AttendancePagination";
import { useEmployeeAttendance } from "@/features/attendances/queries/use-employee-attendance";
import { usePermissions } from "@/hooks/use-permissions";
import { useEmployee } from "@/features/employees/queries/use-employee";

const DEFAULT_PARAMS = {
  page: 1,
  per_page: 20,
  sort_by: "checkIn" as const,
  sort_order: "desc" as const,
};

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

export default function EmployeeAttendancePage({
  params,
}: {
  params: Promise<{
    employee_id: string;
  }>;
}) {
  const { employee_id } = use(params);

  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadAttendances = hasPermission("attendances.read");
  const canReadEmployees = hasPermission("employees.read");

  const [queryParams, setQueryParams] =
    useState(DEFAULT_PARAMS);

  const employee =
    useEmployee(employee_id);

  const attendances =
    useEmployeeAttendance(
      employee_id,
      queryParams,
    );

  if (
    !canReadAttendances ||
    !canReadEmployees
  ) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view employee attendance history.
        </p>
      </div>
    );
  }

  if (
    employee.isLoading ||
    attendances.isLoading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    employee.error ||
    !employee.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load employee.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push("/employees")
          }
        >
          Back to Employees
        </Button>
      </div>
    );
  }

  if (attendances.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load attendance history.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    );
  }

  const data =
    attendances.data?.data ?? [];

  const meta =
    attendances.data?.meta;

  const dataEmployee =
    employee.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Employee Attendance
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review attendance history for this employee.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push(
              `/employees/${dataEmployee.id}`,
            )
          }
        >
          Back to Employee
        </Button>
      </div>

      {/* Employee Information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Employee
            </p>

            <p className="mt-1 font-semibold">
              {dataEmployee.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Employee Code
            </p>

            <p className="mt-1 font-semibold">
              {
                dataEmployee.employeeCode
              }
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Position
            </p>

            <p className="mt-1 font-semibold">
              {dataEmployee.position}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Department
            </p>

            <p className="mt-1 font-semibold">
              {
                dataEmployee
                  .department.name
              }
            </p>
          </div>
        </div>
      </section>

      {/* Attendance History */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5 sm:p-6">
          <h2 className="font-semibold">
            Attendance History
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {meta?.total ?? 0}{" "}
            {meta?.total === 1
              ? "attendance record"
              : "attendance records"}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium">
              No attendance records found.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              This employee does not have any attendance history yet.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">
                      Check In
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Check Out
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.map(
                    (attendance) => (
                      <tr
                        key={
                          attendance.id
                        }
                        className="border-b last:border-0"
                      >
                        <td className="px-5 py-4">
                          {formatDateTime(
                            attendance.checkIn,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {formatDateTime(
                            attendance.checkOut,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                              attendance.status,
                            )}`}
                          >
                            {
                              attendance.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="rounded-lg"
                            onClick={() =>
                              router.push(
                                `/attendances/${attendance.id}`,
                              )
                            }
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="border-t p-4">
                <AttendancePagination
                  page={meta.page}
                  totalPages={
                    meta.total_pages
                  }
                  total={meta.total}
                  perPage={
                    meta.per_page
                  }
                  onPageChange={(
                    page,
                  ) =>
                    setQueryParams(
                      (current) => ({
                        ...current,
                        page,
                      }),
                    )
                  }
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}