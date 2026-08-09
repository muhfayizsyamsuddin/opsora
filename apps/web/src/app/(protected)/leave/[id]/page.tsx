"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  CircleUser,
  FileText,
  X,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  approveLeave,
  getLeaveById,
  rejectLeave,
  deleteLeave,
} from "@/services/leave.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LeaveDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const {
    data: leave,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leave", id],
    queryFn: () => getLeaveById(id),
    enabled: Boolean(id),
  });

  async function handleApprove() {
    try {
      setIsProcessing(true);

      await approveLeave(id);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["leave", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["leaves"],
        }),
      ]);

      toast.success(
        "Leave approved successfully",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to approve leave";

        toast.error(message);
      } else {
        toast.error("Failed to approve leave");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleReject() {
    try {
      setIsProcessing(true);

      await rejectLeave(id);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["leave", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["leaves"],
        }),
      ]);

      toast.success(
        "Leave rejected successfully",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to reject leave";

        toast.error(message);
      } else {
        toast.error("Failed to reject leave");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDelete() {
    try {
        setIsDeleting(true);

        await deleteLeave(id);

        await queryClient.invalidateQueries({
        queryKey: ["leaves"],
        });

        toast.success("Leave deleted successfully");

        router.push("/leave");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            "Failed to delete leave";

        toast.error(message);
        } else {
        toast.error("Failed to delete leave");
        }
    } finally {
        setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/leave"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leave
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading leave request...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !leave) {
    return (
      <div className="space-y-6">
        <Link
          href="/leave"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leave
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Leave request not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPending =
    leave.status === "PENDING";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/leave"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leave
        </Link>

        <div className="mt-3">
          <h1 className="text-2xl font-semibold">
            Leave Detail
          </h1>

          <p className="text-sm text-muted-foreground">
            View leave request information.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {isPending && (
            <>
            <Link href={`/leave/${id}/edit`}>
                <Button variant="outline">
                Edit Leave
                </Button>
            </Link>

            <Button
                onClick={handleApprove}
                disabled={isProcessing || isDeleting}
            >
                <Check className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Approve"}
            </Button>

            <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing || isDeleting}
            >
                <X className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Reject"}
            </Button>
            </>
        )}

        <AlertDialog>
            <AlertDialogTrigger
                className="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                disabled={isDeleting || isProcessing}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Leave
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete Leave?
                </AlertDialogTitle>

                <AlertDialogDescription>
                    Are you sure you want to delete the leave
                    request for{" "}
                    <span className="font-medium">
                    {leave.employee.name}
                    </span>
                    ? This action cannot be undone.
                </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    {isDeleting
                    ? "Deleting..."
                    : "Delete Leave"}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CircleUser className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              {leave.employee.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {leave.employee.email}
            </p>

            <span
              className={
                leave.status === "APPROVED"
                  ? "mt-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  : leave.status === "REJECTED"
                    ? "mt-4 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive"
                    : "mt-4 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              {leave.status}
            </span>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Leave Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Department
                </p>

                <p className="text-sm font-medium">
                  {leave.employee.department.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Leave Period
                </p>

                <p className="text-sm font-medium">
                  {new Date(
                    leave.startDate,
                  ).toLocaleDateString("id-ID")}
                  {" – "}
                  {new Date(
                    leave.endDate,
                  ).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Reason
                </p>

                <p className="text-sm font-medium">
                  {leave.reason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}