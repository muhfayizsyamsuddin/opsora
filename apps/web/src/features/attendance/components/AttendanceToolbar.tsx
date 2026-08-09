"use client";

import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { getEmployees } from "@/services/employee.service";
import {
  AttendanceStatus,
} from "@/services/attendance.service";

type AttendanceToolbarProps = {
  search: string;
  employeeId: string;
  status: AttendanceStatus | "";
  onSearchChange: (value: string) => void;
  onEmployeeChange: (value: string) => void;
  onStatusChange: (
    value: AttendanceStatus | "",
  ) => void;
};

export function AttendanceToolbar({
  search,
  employeeId,
  status,
  onSearchChange,
  onEmployeeChange,
  onStatusChange,
}: AttendanceToolbarProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["employees", "attendance-filter"],
    queryFn: () =>
      getEmployees({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

  const employees = data?.data ?? [];

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search employees..."
          className="pl-9"
        />
      </div>

      <select
        value={employeeId}
        onChange={(event) =>
          onEmployeeChange(event.target.value)
        }
        disabled={isLoading}
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">
          {isLoading
            ? "Loading Employees..."
            : "All Employees"}
        </option>

        {employees.map((employee) => (
          <option
            key={employee.id}
            value={employee.id}
          >
            {employee.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as AttendanceStatus | "",
          )
        }
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All Status</option>
        <option value="PRESENT">Present</option>
        <option value="LATE">Late</option>
        <option value="ABSENT">Absent</option>
        <option value="LEAVE">Leave</option>
      </select>
    </div>
  );
}