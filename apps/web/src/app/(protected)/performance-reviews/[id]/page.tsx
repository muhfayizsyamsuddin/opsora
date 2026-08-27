"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePerformanceReview } from "@/features/performance-reviews/queries/use-performance-review";
import { usePermissions } from "@/hooks/use-permissions";
import { useDeletePerformanceReview } from "@/features/performance-reviews/mutations/use-delete-performance-review";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getScoreStyle(score: number) {
  if (score >= 80) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (score >= 60) {
    return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }

  return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 text-sm font-medium">
        {children}
      </div>
    </div>
  );
}

export default function PerformanceReviewDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { hasPermission } = usePermissions();
  const canReadPerformanceReview = hasPermission("performance_reviews.read");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteReview = useDeletePerformanceReview();
  const review = usePerformanceReview(params.id);

  if (review.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />

        <div className="h-72 animate-pulse rounded-2xl border bg-muted/30" />

        <div className="h-48 animate-pulse rounded-2xl border bg-muted/30" />
      </div>
    );
  }

  if (review.error || !review.data) {
    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          className="rounded-xl"
          onClick={() =>
            router.push("/performance-reviews")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Performance Reviews
        </Button>

        <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Unable to load performance review
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The performance review could not be found
            or an error occurred while loading it.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => review.refetch()}
          >
            Try Again
          </Button>
        </section>
      </div>
    );
  }

  const data = review.data;

  if (!canReadPerformanceReview) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view this performance review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button
            type="button"
            variant="ghost"
            className="-ml-3 mb-3 rounded-xl"
            onClick={() =>
              router.push("/performance-reviews")
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Performance Reviews
          </Button>

          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Performance Review
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review details for{" "}
            <span className="font-medium text-foreground">
              {data.employee.name}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          {hasPermission(
            "performance_reviews.update",
          ) && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                router.push(
                  `/performance-reviews/${data.id}/edit`,
                )
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}

          {hasPermission(
            "performance_reviews.delete",
          ) && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl text-destructive hover:text-destructive"
              disabled={deleteReview.isPending}
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Employee */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold">
            Employee Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Employee associated with this performance
            review.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Name">
            {data.employee.name}
          </DetailItem>

          <DetailItem label="Employee Code">
            {data.employee.employeeCode}
          </DetailItem>

          <DetailItem label="Position">
            {data.employee.position}
          </DetailItem>

          <DetailItem label="Department">
            {data.employee.department?.name ?? "—"}
          </DetailItem>

          <DetailItem label="Email">
            {data.employee.email}
          </DetailItem>

          <DetailItem label="Status">
            {data.employee.status}
          </DetailItem>

          <DetailItem label="Hire Date">
            {formatDate(data.employee.hireDate)}
          </DetailItem>
        </div>
      </section>

      {/* Review */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold">
            Review Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Performance evaluation details.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Reviewer">
            {data.reviewer ? (
              <div>
                <p>{data.reviewer.name}</p>
                <p className="mt-1 text-xs font-normal text-muted-foreground">
                  {data.reviewer.email}
                </p>
              </div>
            ) : (
              data.reviewerLegacy ?? "—"
            )}
          </DetailItem>

          <DetailItem label="Review Period">
            {data.reviewPeriod ?? "—"}
          </DetailItem>

          <DetailItem label="Review Date">
            {formatDate(data.reviewDate)}
          </DetailItem>

          <DetailItem label="Score">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getScoreStyle(
                data.score,
              )}`}
            >
              {data.score} / 100
            </span>
          </DetailItem>
        </div>
      </section>

      {/* Comments */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold">
            Review Notes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Comments and evaluation notes from the
            reviewer.
          </p>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          {data.comments ? (
            <p className="whitespace-pre-wrap text-sm leading-6">
              {data.comments}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No review notes provided.
            </p>
          )}
        </div>
      </section>

      {/* Metadata */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <DetailItem label="Created At">
            {formatDate(data.createdAt)}
          </DetailItem>

          <DetailItem label="Last Updated">
            {formatDate(data.updatedAt)}
          </DetailItem>
        </div>
      </section>
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open && !deleteReview.isPending) {
            setShowDeleteDialog(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete performance review?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete the performance
              review for{" "}
              <span className="font-medium text-foreground">
                {data.employee.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteReview.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteReview.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteReview.mutate(data.id, {
                  onSuccess: () => {
                    router.push(
                      "/performance-reviews",
                    );
                  },
                });
              }}
            >
              {deleteReview.isPending
                ? "Deleting..."
                : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}