"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { getEmployeeById } from "@/services/employee.service";
import { useEmployeeAttendance } from "@/features/attendances/queries/use-employee-attendance";
import { usePerformanceReviewHistory } from "@/features/performance-reviews/queries/use-performance-review-history";
import { usePermissions } from "@/hooks/use-permissions";
function formatCurrency(
  value: string | number,
) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
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
function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getStatusStyle(
  status: string,
) {
  if (status === "ACTIVE") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  return "border-muted bg-muted text-muted-foreground";
}

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadEmployee = hasPermission("employees.read");

  const employee = useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployeeById(id),
  });

  const attendance = useEmployeeAttendance(id, {
    page: 1,
    per_page: 10,
    sort_by: "checkIn",
    sort_order: "desc",
  });
  const performanceHistory = usePerformanceReviewHistory(id, {
    page: 1,
    per_page: 10,
    sort_by: "reviewDate",
    sort_order: "desc",
  });

  if (employee.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />
        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
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

  const data = employee.data;

  if (!canReadEmployee) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this employee.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Employees
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Employee Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review employee information and organizational assignment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/employees")
            }
          >
            Back to Employees
          </Button>

          {/* <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              document
                .getElementById("attendance-history")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            View Attendance
          </Button> */}

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push(
                `/employees/${data.id}/edit`,
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
              Employee Code
            </p>

            <p className="mt-1 font-semibold">
              {data.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Name
            </p>

            <p className="mt-1 font-semibold">
              {data.name}
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
              Email
            </p>

            <p className="mt-1 font-semibold break-all">
              {data.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Position
            </p>

            <p className="mt-1 font-semibold">
              {data.position}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Department
            </p>

            <p className="mt-1 font-semibold">
              {data.department.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Salary
            </p>

            <p className="mt-1 font-semibold">
              {formatCurrency(data.salary)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Hire Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.hireDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      <section
        id="attendance-history"
        className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="mb-5">
          <h2 className="text-base font-semibold">
            Attendance History
         </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recent attendance records for this employee.
          </p>
        </div>

        {attendance.isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
        ) : attendance.error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium">
              Unable to load attendance history.
            </p>
          </div>
        ) : attendance.data?.data.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No attendance records found.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {attendance.data?.data.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {item.status}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Check in:{" "}
                      {formatDateTime(item.checkIn)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      Check out:{" "}
                      {item.checkOut
                        ? formatDateTime(item.checkOut)
                        : "Not checked out"}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() =>
                        router.push(
                          `/attendances/${item.id}`,
                        )
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">
                Performance History
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Recent performance reviews for this employee.
              </p>
            </div>

            {performanceHistory.data &&
              performanceHistory.data.meta.total > 0 && (
                <p className="text-xs text-muted-foreground">
                  {performanceHistory.data.meta.total} review
                  {performanceHistory.data.meta.total !== 1
                    ? "s"
                    : ""}
                </p>
              )}
          </div>

          {performanceHistory.isLoading ? (
            <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
          ) : performanceHistory.error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium">
                Unable to load performance history.
              </p>
            </div>
          ) : performanceHistory.data?.data.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No performance reviews found.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {performanceHistory.data?.data.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        {item.reviewPeriod ?? "Performance Review"}
                      </p>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                          item.score >= 80
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : item.score >= 60
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {item.score} / 100
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Reviewer:{" "}
                      {item.reviewer?.name ??
                        item.reviewerLegacy ??
                        "—"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(item.reviewDate)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl"
                    onClick={() =>
                      router.push(
                        `/performance-reviews/${item.id}`,
                      )
                    }
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
    </div>
  );
}