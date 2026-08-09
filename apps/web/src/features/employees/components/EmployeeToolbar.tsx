"use client";

import { useRouter } from "next/navigation";
import { Search, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getDepartments, type Department, } from "@/services/department.service";
import { EmployeeStatus } from "../types";

type EmployeeToolbarProps = {
  search: string;
  department: string;
  status: EmployeeStatus;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: EmployeeStatus) => void;
};

export function EmployeeToolbar({
  search,
  department,
  status,
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
}: EmployeeToolbarProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      getDepartments({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

  const departments: Department[] = data?.data ?? [];

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
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
          value={department}
          onChange={(event) =>
            onDepartmentChange(event.target.value)
          }
          disabled={isLoading}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">
            {isLoading
              ? "Loading Departments..."
              : "All Departments"}
          </option>

          {departments.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as EmployeeStatus)
          }
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <Button
        onClick={() => router.push("/employees/new")}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
    </div>
  );
}