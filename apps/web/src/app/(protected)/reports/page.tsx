"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ReportStatCard } from "@/features/reports/components/ReportStatCard";
import { useDashboardReport } from "@/features/reports/queries/use-dashboard-report";
import { usePermissions } from "@/hooks/use-permissions";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function ReportsPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadReports = hasPermission("reports.read");

  const report = useDashboardReport(canReadReports);


  if (!canReadReports) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view reports.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Your account does not have the required access.
        </p>
      </div>
    );
  }

  if (report.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      </div>
    );
  }

  if (report.error || !report.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load reports.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    );
  }

  const data = report.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Reports
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Overview
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Operational and workforce overview.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/reports/business")
            }
          >
            Business Reports
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/reports/people")
            }
          >
            People Reports
          </Button>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Workforce
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current employee and attendance indicators.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportStatCard
            label="Employees"
            value={data.totalEmployees}
          />

          <ReportStatCard
            label="Departments"
            value={data.totalDepartments}
          />

          <ReportStatCard
            label="Present Today"
            value={data.presentToday}
          />

          <ReportStatCard
            label="Late Today"
            value={data.lateToday}
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Leave & Payroll
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Current leave status and salary overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <ReportStatCard
            label="Absent Today"
            value={data.absentToday}
          />

          <ReportStatCard
            label="Pending Leaves"
            value={data.pendingLeaves}
          />

          <ReportStatCard
            label="Approved Leaves"
            value={data.approvedLeaves}
          />

          <ReportStatCard
            label="Total Salary"
            value={formatCurrency(
              data.totalSalary,
            )}
          />

          <ReportStatCard
            label="Average Salary"
            value={formatCurrency(
              data.averageSalary,
            )}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">
              Employees by Department
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current employee distribution.
            </p>
          </div>

          <div className="space-y-4">
            {data.employeesByDepartment.map(
              (department) => (
                <div
                  key={department.id}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm">
                    {department.name}
                  </span>

                  <span className="font-semibold">
                    {department.totalEmployees}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">
              Weekly Attendance
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Attendance count for the last 7 days.
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {data.attendanceWeekly.map((item) => (
              <div
                key={item.date}
                className="rounded-xl border bg-muted/20 p-3 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  {item.day}
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {item.attendance}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest workforce activity.
            </p>
          </div>

          <div className="space-y-4">
            {data.recentActivities.map(
              (activity) => (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="rounded-xl border p-4"
                >
                  <p className="text-sm font-medium">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(
                      activity.createdAt,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold">
              Upcoming Leaves
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Approved upcoming leave schedules.
            </p>
          </div>

          <div className="space-y-4">
            {data.upcomingLeaves.map((leave) => (
              <div
                key={leave.id}
                className="rounded-xl border p-4"
              >
                <p className="text-sm font-medium">
                  {leave.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {leave.type}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(
                    leave.startDate,
                  )}{" "}
                  —{" "}
                  {formatDate(
                    leave.endDate,
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}