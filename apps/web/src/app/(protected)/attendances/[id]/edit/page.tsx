"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AttendanceForm } from "@/features/attendances/components/AttendanceForm";
import { useAttendance } from "@/features/attendances/queries/use-attendance";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditAttendancePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadAttendance = hasPermission("attendances.read");
  const canUpdateAttendance = hasPermission("attendances.update");

  const attendance = useAttendance(
    id,
    canReadAttendance && canUpdateAttendance,
  );

  if (
    !canReadAttendance ||
    !canUpdateAttendance
  ) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit attendances.
        </p>
      </div>
    );
  }

  if (attendance.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    attendance.error ||
    !attendance.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load attendance editor.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(
              `/attendances/${id}`,
            )
          }
        >
          Back to Attendance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Attendance
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Attendance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update attendance check out and status.
        </p>
      </div>

      <AttendanceForm
        attendance={attendance.data}
        employees={[]}
      />
    </div>
  );
}