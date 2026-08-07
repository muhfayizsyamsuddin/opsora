import { AttendanceChart } from "@/features/dashboard/components/AttendanceChart";
import { EmployeeDistribution } from "@/features/dashboard/components/employee-distribution-card";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentActivities } from "@/features/dashboard/components/RecentActivities";
import { StatsCards } from "@/features/dashboard/components/StatsCards";
import { UpcomingLeave } from "@/features/dashboard/components/UpcomingLeave";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        <EmployeeDistribution />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivities />

        <UpcomingLeave />
        </div>

    <QuickActions />
    </div>
  );
}