"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { SalePagination } from "@/features/sales/components/SalePagination";
import { SaleTable } from "@/features/sales/components/SaleTable";
import { SaleToolbar } from "@/features/sales/components/SaleToolbar";

import { useSales } from "@/features/sales/queries/use-sales";
import { useCustomers } from "@/features/customers/queries/use-customers";

import type { SaleQueryParams } from "@/features/sales/types/sale";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: SaleQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "saleDate",
  sort_order: "desc",
};

export default function SalesPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadSales = hasPermission("sales.read");
  const canCreateSale = hasPermission("sales.create");
  
  const [params, setParams] =
    useState<SaleQueryParams>(
      DEFAULT_PARAMS,
    );

  const sales = useSales(
    params,
    canReadSales,
  );

  const customers = useCustomers({
    page: 1,
    per_page: 100,
    sort_by: "name",
    sort_order: "asc",
  });

  const saleData =
    sales.data?.data ?? [];

  const meta = sales.data?.meta;

  if (!canReadSales) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view sales.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Core Business
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sales
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage sales transactions and customer payments.
          </p>
        </div>

        {canCreateSale && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/sales/new")
            }
          >
            Add Sale
          </Button>
        )}
      </div>

      <SaleToolbar
        params={params}
        customers={
          customers.data?.data ?? []
        }
        onChange={setParams}
      />

      {sales.isLoading ||
      customers.isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : sales.error ||
        customers.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load sales.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "sale"
                : "sales"}
            </p>
          </div>

          <SaleTable
            sales={saleData}
            onView={(sale) =>
              router.push(
                `/sales/${sale.id}`,
              )
            }
          />

          {meta && (
            <SalePagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}
        </>
      )}
    </div>
  );
}