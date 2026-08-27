"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Employee } from "@/features/employees/types/employee";
import type { PayrollQueryParams } from "@/features/payrolls/types/payroll";

type PayrollToolbarProps = {
  params: PayrollQueryParams;
  employees: Employee[];
  onChange: (
    params: PayrollQueryParams,
  ) => void;
};

export function PayrollToolbar({
  params,
  employees,
  onChange,
}: PayrollToolbarProps) {
  const updateParams = (
    updates: Partial<PayrollQueryParams>,
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
      sort_by: "createdAt",
      sort_order: "desc",
    });
  };

  const hasFilters =
    Boolean(params.search) ||
    Boolean(params.employee_id) ||
    params.month !== undefined ||
    params.year !== undefined;

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          Filters
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Search and filter payroll records.
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
                search:
                  event.target.value ||
                  undefined,
              })
            }
            placeholder="Search employee..."
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
                employee_id:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All employees
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name} —{" "}
                {employee.employeeCode}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Month
          </label>

          <select
            value={
              params.month?.toString() ?? ""
            }
            onChange={(event) =>
              updateParams({
                month: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-foreground/20 focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All months
            </option>

            {Array.from(
              { length: 12 },
              (_, index) => {
                const month = index + 1;

                return (
                  <option
                    key={month}
                    value={month}
                  >
                    {new Intl.DateTimeFormat(
                      "en-US",
                      { month: "long" },
                    ).format(
                      new Date(2024, index, 1),
                    )}
                  </option>
                );
              },
            )}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Year
          </label>

          <Input
            type="number"
            value={params.year ?? ""}
            onChange={(event) =>
              updateParams({
                year: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            placeholder="Year"
            min={2000}
            className="h-10 rounded-xl"
          />
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