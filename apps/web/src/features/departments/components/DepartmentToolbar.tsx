"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  DepartmentQueryParams,
} from "@/features/departments/types/department";

type DepartmentToolbarProps = {
  params: DepartmentQueryParams;
  onChange: (
    params: DepartmentQueryParams,
  ) => void;
};

export function DepartmentToolbar({
  params,
  onChange,
}: DepartmentToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="department-search"
            className="text-sm font-medium"
          >
            Search department
          </label>

          <Input
            id="department-search"
            value={params.search ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                search:
                  event.target.value ||
                  undefined,
              })
            }
            placeholder="Search department..."
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
              sort_by: "createdAt",
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