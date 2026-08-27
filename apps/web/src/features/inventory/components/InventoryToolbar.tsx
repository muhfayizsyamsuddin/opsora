"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { InventoryStockQueryParams } from "@/features/inventory/types/inventory";

type InventoryToolbarProps = {
  params: InventoryStockQueryParams;
  onChange: (params: InventoryStockQueryParams) => void;
};

export function InventoryToolbar({
  params,
  onChange,
}: InventoryToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            placeholder="Search by product name or SKU..."
            className="h-10 rounded-xl pl-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() =>
            onChange({
              page: 1,
              per_page: 20,
              sort_by: "name",
              sort_order: "asc",
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}