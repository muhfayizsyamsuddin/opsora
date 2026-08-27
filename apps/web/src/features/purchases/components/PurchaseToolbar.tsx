"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Supplier } from "@/features/suppliers/types/supplier";
import type { PurchaseQueryParams } from "@/features/purchases/types/purchase";

type PurchaseToolbarProps = {
  params: PurchaseQueryParams;
  suppliers: Supplier[];
  onChange: (
    params: PurchaseQueryParams,
  ) => void;
};

export function PurchaseToolbar({
  params,
  suppliers,
  onChange,
}: PurchaseToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
            <label
            htmlFor="purchase-search"
            className="text-sm font-medium"
            >
            Search supplier
            </label>

            <Input
            id="purchase-search"
            value={params.search ?? ""}
            onChange={(event) =>
                onChange({
                ...params,
                page: 1,
                search:
                    event.target.value || undefined,
                })
            }
            placeholder="Search supplier..."
            className="h-10 rounded-xl"
            />
        </div>

        <div className="space-y-2">
            <label
            htmlFor="purchase-supplier"
            className="text-sm font-medium"
            >
            Supplier
            </label>

            <select
            id="purchase-supplier"
            value={params.supplier_id ?? ""}
            onChange={(event) =>
                onChange({
                ...params,
                page: 1,
                supplier_id:
                    event.target.value || undefined,
                })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
            <option value="">
                All suppliers
            </option>

            {suppliers.map((supplier) => (
                <option
                key={supplier.id}
                value={supplier.id}
                >
                {supplier.name}
                </option>
            ))}
            </select>
        </div>

        <div className="space-y-2">
            <label
            htmlFor="purchase-date-from"
            className="text-sm font-medium"
            >
            From date
            </label>

            <Input
            id="purchase-date-from"
            type="date"
            value={params.date_from ?? ""}
            onChange={(event) =>
                onChange({
                ...params,
                page: 1,
                date_from:
                    event.target.value || undefined,
                })
            }
            className="h-10 rounded-xl"
            />
        </div>

        <div className="space-y-2">
            <label
            htmlFor="purchase-date-to"
            className="text-sm font-medium"
            >
            To date
            </label>

            <Input
            id="purchase-date-to"
            type="date"
            value={params.date_to ?? ""}
            onChange={(event) =>
                onChange({
                ...params,
                page: 1,
                date_to:
                    event.target.value || undefined,
                })
            }
            className="h-10 rounded-xl"
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
                sort_by: "purchaseDate",
                sort_order: "desc",
            })
            }
        >
            Reset
        </Button>
        </div>
    </div>
    );
}