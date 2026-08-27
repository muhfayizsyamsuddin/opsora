"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Department } from "@/features/departments/types/department";

import type {
  EmployeeQueryParams,
  EmployeeStatus,
} from "@/features/employees/types/employee";

type EmployeeToolbarProps = {
  params: EmployeeQueryParams;
  departments: Department[];
  onChange: (
    params: EmployeeQueryParams,
  ) => void;
};

export function EmployeeToolbar({
  params,
  departments,
  onChange,
}: EmployeeToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="employee-search"
            className="text-sm font-medium"
          >
            Search employee
          </label>

          <Input
            id="employee-search"
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
            placeholder="Search name, email, or position..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="employee-department"
            className="text-sm font-medium"
          >
            Department
          </label>

          <select
            id="employee-department"
            value={params.department_id ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                department_id:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All departments
            </option>

            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="employee-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="employee-status"
            value={params.status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                status:
                  (event.target.value ||
                    undefined) as
                    | EmployeeStatus
                    | undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
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