"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Employee } from "@/features/employees/types/employee";
import type { PerformanceReviewQueryParams } from "@/features/performance-reviews/types/performance-review";

type PerformanceReviewToolbarProps = {
  params: PerformanceReviewQueryParams;
  employees: Employee[];
  onChange: (
    params: PerformanceReviewQueryParams,
  ) => void;
};

export function PerformanceReviewToolbar({
  params,
  employees,
  onChange,
}: PerformanceReviewToolbarProps) {
  const updateParams = (
    updates: Partial<PerformanceReviewQueryParams>,
  ) => {
    onChange({
      ...params,
      ...updates,
      page: 1,
    });
  };

  const resetFilters = () => {
    onChange({
      page: 1,
      per_page: 20,
      sort_by: "reviewDate",
      sort_order: "desc",
    });
  };

  const hasFilters =
    Boolean(params.search) ||
    Boolean(params.employee_id) ||
    params.sort_by !== "reviewDate";

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          Filters
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Search and filter performance reviews.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Search Employee
          </label>

          <Input
            value={params.search ?? ""}
            onChange={(event) =>
              updateParams({
                search: event.target.value || undefined,
              })
            }
            placeholder="Search employee name..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Employee
          </label>

          <select
            value={params.employee_id ?? ""}
            onChange={(event) =>
              updateParams({
                employee_id: event.target.value || undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="">All employees</option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name} — {employee.employeeCode}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Sort By
          </label>

          <select
            value={params.sort_by ?? "reviewDate"}
            onChange={(event) =>
              updateParams({
                sort_by:
                  event.target.value as PerformanceReviewQueryParams["sort_by"],
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="reviewDate">
              Review Date
            </option>
            <option value="score">
              Score
            </option>
            <option value="createdAt">
              Created At
            </option>
          </select>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl lg:w-auto"
            onClick={resetFilters}
          >
            Reset
          </Button>
        )}
      </div>
    </section>
  );
}