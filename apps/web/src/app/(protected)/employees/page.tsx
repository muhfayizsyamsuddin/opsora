"use client";

import { useState } from "react";

import { EmployeeTable } from "@/features/employees/components/EmployeeTable";
import { EmployeeToolbar } from "@/features/employees/components/EmployeeToolbar";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE" | ""
    >("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Employees
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your employees and their information.
        </p>
      </div>

      <EmployeeToolbar
        search={search}
        department={department}
        status={status}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartment}
        onStatusChange={setStatus}
      />

      <EmployeeTable
        search={search}
        department={department}
        status={status}
      />
    </div>
  );
}