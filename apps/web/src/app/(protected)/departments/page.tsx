"use client";

import { useState } from "react";

import { DepartmentToolbar } from "@/features/department/components/DepartmentToolbar";
import { DepartmentTable } from "@/features/department/components/DepartmentTable";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Departments
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage your departments and their information.
        </p>
      </div>

      <DepartmentToolbar
        search={search}
        onSearchChange={setSearch}
      />

      <DepartmentTable
        search={search}
      />
    </div>
  );
}