"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Category } from "@/features/categories/types/category";
import type {
  ProductQueryParams,
  ProductStockStatus,
} from "@/features/products/types/product";

type ProductToolbarProps = {
  params: ProductQueryParams;
  categories: Category[];
  onChange: (params: ProductQueryParams) => void;
};

export function ProductToolbar({
  params,
  categories,
  onChange,
}: ProductToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={params.search ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                search: event.target.value || undefined,
              })
            }
            placeholder="Search by name, SKU, or barcode..."
            className="h-10 rounded-xl pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={params.category_id ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                category_id:
                  event.target.value || undefined,
              })
            }
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={params.stock_status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                stock_status:
                  (event.target.value || undefined) as
                    | ProductStockStatus
                    | undefined,
              })
            }
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All stock</option>
            <option value="LOW">Low stock</option>
          </select>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() =>
              onChange({
                page: 1,
                per_page: 20,
                sort_by: "createdAt",
                sort_order: "desc",
              })
            }
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}