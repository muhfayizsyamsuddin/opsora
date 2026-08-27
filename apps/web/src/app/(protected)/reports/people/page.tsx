"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ReportStatCard } from "@/features/reports/components/ReportStatCard";
import { usePeopleReports } from "@/features/reports/queries/use-people-reports";
import { usePermissions } from "@/hooks/use-permissions";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatScore(value: string | number) {
  return Number(value).toFixed(2);
}

export default function PeopleReportsPage() {
  const router = useRouter();

  const reports = usePeopleReports();
  const { hasPermission } = usePermissions();
  const canReadReports = hasPermission("reports.read");
  
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

  if (reports.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 12 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border bg-muted/30"
              />
            ),
          )}
        </div>
      </div>
    );
  }

  if (reports.hasError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load people reports.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>
      </div>
    );
  }

  const performance = reports.performance.data;
  const attendance = reports.attendance.data;
  const leave = reports.leave.data;
  const payroll = reports.payroll.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Reports
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            People Reports
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Workforce attendance, leave, payroll, and performance overview.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              router.push("/reports")
            }
          >
            Overview
          </Button>

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
        </div>
      </div>

      {/* Attendance */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Attendance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Attendance record summary.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <ReportStatCard
            label="Total Attendances"
            value={
              attendance?.totalAttendances ?? 0
            }
          />

          <ReportStatCard
            label="Present"
            value={attendance?.present ?? 0}
          />

          <ReportStatCard
            label="Late"
            value={attendance?.late ?? 0}
          />

          <ReportStatCard
            label="Absent"
            value={attendance?.absent ?? 0}
          />

          <ReportStatCard
            label="Leave"
            value={attendance?.leave ?? 0}
          />
        </div>
      </section>

      {/* Leave */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Leave
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Leave request status summary.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportStatCard
            label="Total Leaves"
            value={leave?.totalLeaves ?? 0}
          />

          <ReportStatCard
            label="Pending"
            value={
              leave?.pendingLeaves ?? 0
            }
          />

          <ReportStatCard
            label="Approved"
            value={
              leave?.approvedLeaves ?? 0
            }
          />

          <ReportStatCard
            label="Rejected"
            value={
              leave?.rejectedLeaves ?? 0
            }
          />
        </div>
      </section>

      {/* Payroll */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Payroll
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Payroll aggregate overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <ReportStatCard
            label="Total Payroll"
            value={formatCurrency(
              payroll?.totalPayroll ?? 0,
            )}
          />

          <ReportStatCard
            label="Average Payroll"
            value={formatCurrency(
              payroll?.averagePayroll ?? 0,
            )}
          />

          <ReportStatCard
            label="Payroll Records"
            value={
              payroll?.totalPayrollRecords ?? 0
            }
          />

          <ReportStatCard
            label="Highest Payroll"
            value={
              payroll?.highestPayroll
                ? formatCurrency(
                    payroll.highestPayroll
                      .totalSalary,
                  )
                : "—"
            }
            description={
              payroll?.highestPayroll
                ? payroll.highestPayroll
                    .employee
                : "No payroll data"
            }
          />

          <ReportStatCard
            label="Lowest Payroll"
            value={
              payroll?.lowestPayroll
                ? formatCurrency(
                    payroll.lowestPayroll
                      .totalSalary,
                  )
                : "—"
            }
            description={
              payroll?.lowestPayroll
                ? payroll.lowestPayroll.employee
                : "No payroll data"
            }
          />
        </div>
      </section>

      {/* Performance */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Performance
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Employee performance review summary.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportStatCard
            label="Average Score"
            value={
              performance
                ? formatScore(
                    performance.averageScore,
                  )
                : "—"
            }
          />

          <ReportStatCard
            label="Total Reviews"
            value={
              performance?.totalReviews ?? 0
            }
          />

          <ReportStatCard
            label="Highest Score"
            value={
              performance?.highestScore
                ? formatScore(
                    performance.highestScore
                      .score,
                  )
                : "—"
            }
            description={
              performance?.highestScore
                ? performance.highestScore
                    .employee
                : "No review data"
            }
          />

          <ReportStatCard
            label="Lowest Score"
            value={
              performance?.lowestScore
                ? formatScore(
                    performance.lowestScore.score,
                  )
                : "—"
            }
            description={
              performance?.lowestScore
                ? performance.lowestScore.employee
                : "No review data"
            }
          />
        </div>
      </section>
    </div>
  );
}