"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardReport } from "@/services/report.service";

import { AttendanceChart } from "@/features/dashboard/components/AttendanceChart";
import { EmployeeDistribution } from "@/features/dashboard/components/employee-distribution-card";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentActivities } from "@/features/dashboard/components/RecentActivities";
import { StatsCards } from "@/features/dashboard/components/StatsCards";
import { UpcomingLeave } from "@/features/dashboard/components/UpcomingLeave";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard-report"],
    queryFn: getDashboardReport,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of your organization.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard
          </h1>

          <p className="text-sm text-muted-foreground">
            Overview of your organization.
          </p>
        </div>

        <p className="text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Overview of your organization.
        </p>
      </div>

      <StatsCards
        totalEmployees={data.totalEmployees}
        totalDepartments={data.totalDepartments}
        presentToday={data.presentToday}
        pendingLeaves={data.pendingLeaves}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart data={data.attendanceWeekly} />
        </div>

        <EmployeeDistribution
          departments={data.employeesByDepartment}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivities
          activities={data.recentActivities}
        />

        <UpcomingLeave
          leaves={data.upcomingLeaves}
        />
      </div>

      <QuickActions />
    </div>
  );
}