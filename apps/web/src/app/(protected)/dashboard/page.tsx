"use client";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardKpiGrid } from "@/features/dashboard/components/DashboardKpiGrid";
import { LowStockProducts } from "@/features/dashboard/components/LowStockProducts";
import { PeopleSummary } from "@/features/dashboard/components/PeopleSummary";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";
import { useDashboardSummary } from "@/features/dashboard/queries/use-dashboard-summary";
import { useLowStock } from "@/features/dashboard/queries/use-low-stock";
import { usePeopleSummary } from "@/features/dashboard/queries/use-people-summary";
import { useRecentTransactions } from "@/features/dashboard/queries/use-recent-transactions";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuthStore } from "@/stores/auth.store";

function SectionSkeleton() {
  return (
    <div className="h-64 animate-pulse rounded-2xl border bg-muted/40" />
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { hasPermission } = usePermissions();
  const canReadDashboard = hasPermission("dashboard.read");

  const summary = useDashboardSummary(canReadDashboard);
  const recentTransactions = useRecentTransactions(canReadDashboard);
  const lowStock = useLowStock(canReadDashboard);
  const peopleSummary = usePeopleSummary(canReadDashboard);

  if (!canReadDashboard) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view the dashboard.
        </p>
      </div>
    );
  }
  const isInitialLoading =
    summary.isLoading ||
    recentTransactions.isLoading ||
    lowStock.isLoading ||
    peopleSummary.isLoading;

  if (isInitialLoading) {
    return (
      <div className="space-y-8">
        <DashboardHeader userName={user?.name} />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <SectionSkeleton key={index} />
            ),
          )}
        </div>

        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    );
  }

  const firstError =
    summary.error ??
    recentTransactions.error ??
    lowStock.error ??
    peopleSummary.error;

  if (firstError) {
    return (
      <div className="space-y-8">
        <DashboardHeader userName={user?.name} />

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load dashboard.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (
    !summary.data ||
    !recentTransactions.data ||
    !lowStock.data ||
    !peopleSummary.data
  ) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader userName={user?.name} />

      <DashboardKpiGrid data={summary.data} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <RecentTransactions
          data={recentTransactions.data}
        />

        <LowStockProducts
          data={lowStock.data}
        />
      </div>

      <PeopleSummary data={peopleSummary.data} />
    </div>
  );
}