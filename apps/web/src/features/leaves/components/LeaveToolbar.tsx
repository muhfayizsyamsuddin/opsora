"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  LeaveQueryParams,
  LeaveStatus,
} from "@/features/leaves/types/leave";

type LeaveEmployeeOption = {
  id: string;
  employeeCode: string;
  name: string;
};

type LeaveToolbarProps = {
  params: LeaveQueryParams;
  employees: LeaveEmployeeOption[];
  onChange: (params: LeaveQueryParams) => void;
};

export function LeaveToolbar({
  params,
  employees,
  onChange,
}: LeaveToolbarProps) {

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        {/* Search */}
        <div className="space-y-2">
          <label
            htmlFor="leave-search"
            className="text-sm font-medium"
          >
            Search employee
          </label>

          <Input
            id="leave-search"
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
            placeholder="Search name or email..."
            className="h-10 rounded-xl"
          />
        </div>

        {/* Employee */}
        <div className="space-y-2">
          <label
            htmlFor="leave-employee"
            className="text-sm font-medium"
          >
            Employee
          </label>

          <select
            id="leave-employee"
            value={params.employee_id ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                employee_id:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
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

        {/* Status */}
        <div className="space-y-2">
          <label
            htmlFor="leave-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="leave-status"
            value={params.status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                status:
                  (event.target.value ||
                    undefined) as
                    | LeaveStatus
                    | undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">
              All statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>
        </div>

        {/* Reset */}
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