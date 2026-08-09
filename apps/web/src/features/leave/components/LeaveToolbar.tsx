"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { LeaveStatus } from "@/services/leave.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LeaveToolbarProps = {
  search: string;
  status: LeaveStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: LeaveStatus | "",
  ) => void;
};

export function LeaveToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: LeaveToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
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
        value={status}
        onChange={(event) =>
          onStatusChange(
            event.target.value as LeaveStatus | "",
          )
        }
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
       <Link href="/leave/new">
        <Button>
            Add Leave
        </Button>
      </Link>
    </div>
  );
}