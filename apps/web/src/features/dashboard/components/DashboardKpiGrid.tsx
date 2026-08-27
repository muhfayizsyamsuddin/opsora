import {
  Boxes,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type { DashboardSummary } from "@/features/dashboard/types/dashboard";

type DashboardKpiGridProps = {
  data: DashboardSummary;
};

const cards = [
  {
    key: "products",
    label: "Products",
    icon: Package,
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Boxes,
  },
  {
    key: "sales",
    label: "Sales",
    icon: ShoppingCart,
  },
  {
    key: "purchases",
    label: "Purchases",
    icon: Truck,
  },
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardKpiGrid({
  data,
}: DashboardKpiGridProps) {
  const values = {
    products: {
      value: formatNumber(data.inventory.totalActiveProducts),
      description: `${formatNumber(data.inventory.totalProducts)} total`,
    },
    inventory: {
      value: formatNumber(data.inventory.totalStockQuantity),
      description: `${formatNumber(data.inventory.totalActiveProducts)} active products`,
    },
    sales: {
      value: formatCurrency(data.sales.totalAmount),
      description: `${formatNumber(data.sales.totalCount)} completed transactions`,
    },
    purchases: {
      value: formatCurrency(data.purchases.totalAmount),
      description: `${formatNumber(data.purchases.totalCount)} completed transactions`,
    },
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = values[card.key];

        return (
          <div
            key={card.key}
            className="group rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>

                <p className="mt-3 text-[2rem] font-semibold tracking-tight">
                  {value.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {value.description}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/60">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}