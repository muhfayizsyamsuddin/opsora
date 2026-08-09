"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getDashboardReport,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getPerformanceReport,
} from "@/services/report.service";

type ReportTab =
  | "overview"
  | "attendance"
  | "leave"
  | "payroll"
  | "performance";

function formatCurrency(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <p className="mt-2 text-2xl font-semibold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] =
    useState<ReportTab>("overview");

  const dashboardQuery = useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardReport,
  });

  const attendanceQuery = useQuery({
    queryKey: ["reports", "attendance"],
    queryFn: getAttendanceReport,
  });

  const leaveQuery = useQuery({
    queryKey: ["reports", "leaves"],
    queryFn: getLeaveReport,
  });

  const payrollQuery = useQuery({
    queryKey: ["reports", "payroll"],
    queryFn: getPayrollReport,
  });

  const performanceQuery = useQuery({
    queryKey: ["reports", "performance"],
    queryFn: getPerformanceReport,
  });

  const isLoading =
    dashboardQuery.isLoading ||
    attendanceQuery.isLoading ||
    leaveQuery.isLoading ||
    payrollQuery.isLoading ||
    performanceQuery.isLoading;

  const hasError =
    dashboardQuery.isError ||
    attendanceQuery.isError ||
    leaveQuery.isError ||
    payrollQuery.isError ||
    performanceQuery.isError;

  const dashboard = dashboardQuery.data;
  const attendance = attendanceQuery.data;
  const leave = leaveQuery.data;
  const payroll = payrollQuery.data;
  const performance = performanceQuery.data;

  const tabs: {
    value: ReportTab;
    label: string;
  }[] = [
    {
      value: "overview",
      label: "Overview",
    },
    {
      value: "attendance",
      label: "Attendance",
    },
    {
      value: "leave",
      label: "Leave",
    },
    {
      value: "payroll",
      label: "Payroll",
    },
    {
      value: "performance",
      label: "Performance",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Reports
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of company data and performance.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading reports...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Reports
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of company data and performance.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Failed to load reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Reports
        </h1>

        <p className="text-sm text-muted-foreground">
          Overview of company data and performance.
        </p>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setActiveTab(tab.value)
              }
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Overview
            </h2>

            <p className="text-sm text-muted-foreground">
              Company overview and employee statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Employees"
              value={
                dashboard?.totalEmployees ?? 0
              }
            />

            <StatCard
              title="Total Departments"
              value={
                dashboard?.totalDepartments ?? 0
              }
            />

            <StatCard
              title="Present Today"
              value={
                dashboard?.presentToday ?? 0
              }
            />

            <StatCard
              title="Late Today"
              value={
                dashboard?.lateToday ?? 0
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Absent Today"
              value={
                dashboard?.absentToday ?? 0
              }
            />

            <StatCard
              title="Total Salary"
              value={formatCurrency(
                dashboard?.totalSalary ?? 0,
              )}
            />

            <StatCard
              title="Average Salary"
              value={formatCurrency(
                dashboard?.averageSalary ?? 0,
              )}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Employees by Department
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {dashboard?.employeesByDepartment?.map(
                  (department) => (
                    <div
                      key={department.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">
                        {department.name}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {department.totalEmployees}{" "}
                        employees
                      </span>
                    </div>
                  ),
                )}

                {(!dashboard
                  ?.employeesByDepartment ||
                  dashboard.employeesByDepartment
                    .length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No department data found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Attendance
            </h2>

            <p className="text-sm text-muted-foreground">
              Attendance statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Total"
              value={
                attendance?.totalAttendances ?? 0
              }
            />

            <StatCard
              title="Present"
              value={attendance?.present ?? 0}
            />

            <StatCard
              title="Late"
              value={attendance?.late ?? 0}
            />

            <StatCard
              title="Absent"
              value={attendance?.absent ?? 0}
            />

            <StatCard
              title="Leave"
              value={attendance?.leave ?? 0}
            />
          </div>
        </div>
      )}

      {/* Leave */}
      {activeTab === "leave" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Leave
            </h2>

            <p className="text-sm text-muted-foreground">
              Leave request statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Leaves"
              value={leave?.totalLeaves ?? 0}
            />

            <StatCard
              title="Pending"
              value={
                leave?.pendingLeaves ?? 0
              }
            />

            <StatCard
              title="Approved"
              value={
                leave?.approvedLeaves ?? 0
              }
            />

            <StatCard
              title="Rejected"
              value={
                leave?.rejectedLeaves ?? 0
              }
            />
          </div>
        </div>
      )}

      {/* Payroll */}
      {activeTab === "payroll" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Payroll
            </h2>

            <p className="text-sm text-muted-foreground">
              Payroll statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Payroll"
              value={formatCurrency(
                payroll?.totalPayroll ?? 0,
              )}
            />

            <StatCard
              title="Average Payroll"
              value={formatCurrency(
                payroll?.averagePayroll ?? 0,
              )}
            />

            <StatCard
              title="Payroll Records"
              value={
                payroll?.totalPayrollRecords ?? 0
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Highest Payroll
                </CardTitle>
              </CardHeader>

              <CardContent>
                {payroll?.highestPayroll ? (
                  <>
                    <p className="font-medium">
                      {
                        payroll.highestPayroll
                          .employee
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(
                        payroll.highestPayroll
                          .totalSalary,
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No payroll data.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Lowest Payroll
                </CardTitle>
              </CardHeader>

              <CardContent>
                {payroll?.lowestPayroll ? (
                  <>
                    <p className="font-medium">
                      {
                        payroll.lowestPayroll
                          .employee
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(
                        payroll.lowestPayroll
                          .totalSalary,
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No payroll data.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">
              Performance
            </h2>

            <p className="text-sm text-muted-foreground">
              Performance review statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title="Average Score"
              value={Number(
                performance?.averageScore ?? 0,
              ).toFixed(1)}
            />

            <StatCard
              title="Total Reviews"
              value={
                performance?.totalReviews ?? 0
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Highest Score
                </CardTitle>
              </CardHeader>

              <CardContent>
                {performance?.highestScore ? (
                  <>
                    <p className="font-medium">
                      {
                        performance.highestScore
                          .employee
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Score:{" "}
                      {
                        performance.highestScore
                          .score
                      }
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No performance data.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Lowest Score
                </CardTitle>
              </CardHeader>

              <CardContent>
                {performance?.lowestScore ? (
                  <>
                    <p className="font-medium">
                      {
                        performance.lowestScore
                          .employee
                      }
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Score:{" "}
                      {
                        performance.lowestScore
                          .score
                      }
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No performance data.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}