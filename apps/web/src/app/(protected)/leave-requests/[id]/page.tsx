"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { getLeaveById } from "@/services/leave.service";
import { useApproveLeave } from "@/features/leaves/mutations/use-approve-leave";
import { useRejectLeave } from "@/features/leaves/mutations/use-reject-leave";
import { useCancelLeave } from "@/features/leaves/mutations/use-cancel-leave";
import { usePermissions } from "@/hooks/use-permissions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "APPROVED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "REJECTED":
      return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

    case "CANCELLED":
      return "border-muted bg-muted text-muted-foreground";

    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

function getDuration(
  startDate: string,
  endDate: string,
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    end.getTime() - start.getTime();

  return (
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    ) + 1
  );
}

export default function LeaveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const approveLeaveMutation = useApproveLeave();
  const rejectLeaveMutation = useRejectLeave();
  const cancelLeaveMutation = useCancelLeave();

  const { hasPermission } = usePermissions();
  const canRead = hasPermission("leaves.read");
  const canUpdate = hasPermission("leaves.update");
  const canApprove = hasPermission("leaves.approve");
  const canReject = hasPermission("leaves.reject");
  const canCancel = hasPermission("leaves.cancel");

  const leave = useQuery({
    queryKey: ["leaves", id],
    queryFn: () => getLeaveById(id),
  });

  if (!canRead) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view leave requests.
        </p>
      </div>
    );
  }

  if (leave.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (leave.error || !leave.data) {
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
            router.push("/leave-requests")
          }
        >
          Back to Leave Requests
        </Button>
      </div>
    );
  }

  const data = leave.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Leave
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Leave Detail
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review employee leave request information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
              router.push("/leave-requests")
              }
          >
              Back to Leave Requests
          </Button>

          {data.status === "PENDING" &&
            (canApprove || canReject) && (
              <>
                {canApprove && (
                  <Button
                    type="button"
                    className="rounded-xl"
                    disabled={
                      approveLeaveMutation.isPending ||
                      rejectLeaveMutation.isPending ||
                      cancelLeaveMutation.isPending
                    }
                    onClick={() =>
                      approveLeaveMutation.mutate(
                        data.id,
                        {
                          onSuccess: () => {
                            router.refresh();
                          },
                        },
                      )
                    }
                  >
                    {approveLeaveMutation.isPending
                      ? "Approving..."
                      : "Approve"}
                  </Button>
                )}

                {canReject && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    disabled={
                      approveLeaveMutation.isPending ||
                      rejectLeaveMutation.isPending ||
                      cancelLeaveMutation.isPending
                    }
                    onClick={() =>
                      rejectLeaveMutation.mutate(
                        data.id,
                        {
                          onSuccess: () => {
                            router.refresh();
                          },
                        },
                      )
                    }
                  >
                    {rejectLeaveMutation.isPending
                      ? "Rejecting..."
                      : "Reject"}
                  </Button>
                )}
              </>
          )}
          {data.status === "PENDING" &&
            canCancel && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl text-destructive hover:text-destructive"
                disabled={
                  approveLeaveMutation.isPending ||
                  rejectLeaveMutation.isPending ||
                  cancelLeaveMutation.isPending
                }
                onClick={() =>
                  cancelLeaveMutation.mutate(
                    data.id,
                    {
                      onSuccess: () => {
                        router.refresh();
                      },
                    },
                  )
                }
              >
                {cancelLeaveMutation.isPending
                  ? "Cancelling..."
                  : "Cancel"}
              </Button>
            )
          }

          {data.status === "PENDING" &&
            canUpdate && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() =>
                  router.push(
                    `/leave-requests/${data.id}/edit`,
                  )
                }
              >
                Edit
              </Button>
            )
          }
        </div>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Employee
            </p>

            <p className="mt-1 font-semibold">
              {data.employee.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Employee Code
            </p>

            <p className="mt-1 font-semibold">
              {data.employee.employeeCode}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                data.status,
              )}`}
            >
              {data.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Email
            </p>

            <p className="mt-1 break-all font-semibold">
              {data.employee.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Start Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              End Date
            </p>

            <p className="mt-1 font-semibold">
              {formatDate(data.endDate)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Duration
            </p>

            <p className="mt-1 font-semibold">
              {getDuration(
                data.startDate,
                data.endDate,
              )}{" "}
              {getDuration(
                data.startDate,
                data.endDate,
              ) === 1
                ? "day"
                : "days"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Created At
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(data.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-semibold">
              {formatDateTime(data.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Reason
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Employees reason for requesting leave.
          </p>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6">
            {data.reason}
          </p>
        </div>
      </section>
    </div>
  );
}