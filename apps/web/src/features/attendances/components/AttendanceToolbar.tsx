"use client";

import { Input } from "@/components/ui/input";

import type { Employee } from "@/features/employees/types/employee";

import type {
  AttendanceQueryParams,
  AttendanceStatus,
} from "@/features/attendances/types/attendance";

type AttendanceToolbarProps = {
  params: AttendanceQueryParams;
  employees: Employee[];
  onChange: (
    params: AttendanceQueryParams,
  ) => void;
};

export function AttendanceToolbar({
  params,
  employees,
  onChange,
}: AttendanceToolbarProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor="attendance-search"
            className="text-sm font-medium"
          >
            Search
          </label>

          <Input
            id="attendance-search"
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
            placeholder="Search employee..."
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="attendance-date"
            className="text-sm font-medium"
          >
            Date
          </label>

          <Input
            id="attendance-date"
            type="date"
            value={params.date ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                date:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="attendance-employee"
            className="text-sm font-medium"
          >
            Employee
          </label>

          <select
            id="attendance-employee"
            value={
              params.employee_id ?? ""
            }
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                employee_id:
                  event.target.value ||
                  undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
          >
            <option value="">
              All employees
            </option>

            {employees.map(
              (employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="attendance-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="attendance-status"
            value={params.status ?? ""}
            onChange={(event) =>
              onChange({
                ...params,
                page: 1,
                status:
                  (event.target.value ||
                    undefined) as
                    | AttendanceStatus
                    | undefined,
              })
            }
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
          >
            <option value="">
              All statuses
            </option>

            <option value="PRESENT">
              Present
            </option>

            <option value="LATE">
              Late
            </option>

            <option value="ABSENT">
              Absent
            </option>

            <option value="LEAVE">
              Leave
            </option>
          </select>
        </div>

        <button
          type="button"
          className="h-10 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
          onClick={() =>
            onChange({
              page: 1,
              per_page: 20,
              sort_by: "checkIn",
              sort_order: "desc",
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}