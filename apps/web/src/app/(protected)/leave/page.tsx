"use client";

import { useState } from "react";

import { LeaveTable } from "@/features/leave/components/LeaveTable";
import { LeaveToolbar } from "@/features/leave/components/LeaveToolbar";
import type { LeaveStatus } from "@/services/leave.service";

export default function LeavePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<LeaveStatus | "">("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Leave
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage employee leave requests.
        </p>
      </div>

      <LeaveToolbar
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <LeaveTable
        search={search}
        status={status}
      />
    </div>
  );
}