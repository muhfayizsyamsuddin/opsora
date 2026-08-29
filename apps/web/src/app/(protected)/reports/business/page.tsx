"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ReportStatCard } from "@/features/reports/components/ReportStatCard";
import { useBusinessReports } from "@/features/reports/queries/use-business-reports";
import { usePermissions } from "@/hooks/use-permissions";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function BusinessReportsPage() {
  const router = useRouter();
  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");
  
  const { hasPermission } = usePermissions();
  const canReadReports = hasPermission("reports.read");
    
  const reports = useBusinessReports(
    {
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    },
    canReadReports,
  );

  
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

  const resetDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Reports
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Business Reports
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sales, purchases, inventory, and profit overview.
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
              router.push("/reports/people")
            }
          >
            People Reports
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <div className="space-y-2">
            <label
              htmlFor="report-date-from"
              className="text-sm font-medium"
            >
              From date
            </label>

            <Input
              id="report-date-from"
              type="date"
              value={dateFrom}
              onChange={(event) =>
                setDateFrom(
                  event.target.value,
                )
              }
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-date-to"
              className="text-sm font-medium"
            >
              To date
            </label>

            <Input
              id="report-date-to"
              type="date"
              value={dateTo}
              onChange={(event) =>
                setDateTo(
                  event.target.value,
                )
              }
              className="h-10 rounded-xl"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={resetDates}
          >
            Reset
          </Button>
        </div>
      </section>

      {reports.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      ) : reports.hasError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load business reports.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Sales
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Sales transaction performance.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ReportStatCard
                label="Total Sales"
                value={
                  reports.sales.data?.totalSales ?? 0
                }
              />

              <ReportStatCard
                label="Completed"
                value={
                  reports.sales.data?.completedSales ?? 0
                }
              />

              <ReportStatCard
                label="Cancelled"
                value={
                  reports.sales.data?.cancelledSales ?? 0
                }
              />

              <ReportStatCard
                label="Revenue"
                value={formatCurrency(
                  reports.sales.data
                    ?.totalRevenue ?? 0,
                )}
              />
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Purchases
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Supplier purchase performance.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <ReportStatCard
                label="Total Purchases"
                value={
                  reports.purchases.data
                    ?.totalPurchases ?? 0
                }
              />

              <ReportStatCard
                label="Completed"
                value={
                  reports.purchases.data
                    ?.completedPurchases ?? 0
                }
              />

              <ReportStatCard
                label="Draft"
                value={
                  reports.purchases.data
                    ?.draftPurchases ?? 0
                }
              />

              <ReportStatCard
                label="Cancelled"
                value={
                  reports.purchases.data
                    ?.cancelledPurchases ?? 0
                }
              />

              <ReportStatCard
                label="Purchase Amount"
                value={formatCurrency(
                  reports.purchases.data
                    ?.totalPurchaseAmount ?? 0,
                )}
              />
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Inventory
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Current inventory and movement overview.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <ReportStatCard
                label="Products"
                value={
                  reports.inventory.data
                    ?.totalProducts ?? 0
                }
              />

              <ReportStatCard
                label="Active Products"
                value={
                  reports.inventory.data
                    ?.totalActiveProducts ?? 0
                }
              />

              <ReportStatCard
                label="Stock Quantity"
                value={
                  reports.inventory.data
                    ?.totalStockQuantity ?? 0
                }
              />

              <ReportStatCard
                label="Low Stock"
                value={
                  reports.inventory.data
                    ?.lowStockCount ?? 0
                }
              />

              <ReportStatCard
                label="Stock In"
                value={
                  reports.inventory.data
                    ?.totalStockIn ?? 0
                }
              />

              <ReportStatCard
                label="Stock Out"
                value={
                  reports.inventory.data
                    ?.totalStockOut ?? 0
                }
              />
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-base font-semibold">
                Net Trading Difference
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Completed sales versus completed purchases.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ReportStatCard
                label="Revenue"
                value={formatCurrency(
                  reports.profit.data
                    ?.revenue ?? 0,
                )}
              />

              <ReportStatCard
                label="Purchase Cost"
                value={formatCurrency(
                  reports.profit.data
                    ?.purchaseCost ?? 0,
                )}
              />

              <ReportStatCard
                label="Net Difference"
                value={formatCurrency(
                  reports.profit.data
                    ?.profit ?? 0,
                )}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}