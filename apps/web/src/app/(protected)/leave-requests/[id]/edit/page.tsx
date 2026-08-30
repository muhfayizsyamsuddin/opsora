"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { LeaveForm } from "@/features/leaves/components/LeaveForm";
import { useLeave } from "@/features/leaves/queries/use-leave";
import { usePermissions } from "@/hooks/use-permissions";

export default function EditLeavePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canReadLeaveRequest = hasPermission("leaves.read");
  const canUpdateLeaveRequest = hasPermission("leaves.update");

  const leave = useLeave(
    id,
    canReadLeaveRequest && canUpdateLeaveRequest,
  );

  if (
    !canReadLeaveRequest ||
    !canUpdateLeaveRequest
  ) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit leave requests.
        </p>
      </div>
    );
  }

  if (leave.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-80 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (
    leave.error ||
    !leave.data
  ) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load leave request.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() =>
            router.push(
              "/leave-requests",
            )
          }
        >
          Back to Leave Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Leave
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Leave
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update employee leave request information.
        </p>
      </div>

      <LeaveForm
        leave={leave.data}
        employees={[]}
      />
    </div>
  );
}