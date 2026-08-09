"use client";

import { useState } from "react";

import { AttendanceToolbar } from "@/features/attendance/components/AttendanceToolbar";
import { AttendanceTable } from "@/features/attendance/components/AttendanceTable";
import {
  AttendanceStatus,
} from "@/services/attendance.service";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] =
    useState("");
  const [status, setStatus] =
    useState<AttendanceStatus | "">("");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
            <h1 className="text-2xl font-semibold">
            Attendance
            </h1>

            <p className="text-sm text-muted-foreground">
            Manage employee attendance records.
            </p>
        </div>

        <Link href="/attendance/new">
            <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Attendance
            </Button>
        </Link>
      </div>

      <AttendanceToolbar
        search={search}
        employeeId={employeeId}
        status={status}
        onSearchChange={setSearch}
        onEmployeeChange={setEmployeeId}
        onStatusChange={setStatus}
      />

      <AttendanceTable
        search={search}
        employeeId={employeeId}
        status={status}
      />
    </div>
  );
}