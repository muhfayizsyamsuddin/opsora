"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { useDeletePerformanceReview } from "@/features/performance-reviews/mutations/use-delete-performance-review";
import { PerformanceReviewTable } from "@/features/performance-reviews/components/performance-review-table";
import { usePerformanceReviews } from "@/features/performance-reviews/queries/use-performance-reviews";
import { PerformanceReviewPagination } from "@/features/performance-reviews/components/PerformanceReviewPagination";
import type {
  PerformanceReviewQueryParams,
  PerformanceReview,
} from "@/features/performance-reviews/types/performance-review";
import { useEmployees } from "@/features/employees/queries/use-employees";
import { PerformanceReviewToolbar } from "@/features/performance-reviews/components/performance-review-toolbar";
import { usePermissions } from "@/hooks/use-permissions";

const DEFAULT_PARAMS: PerformanceReviewQueryParams = {
  page: 1,
  per_page: 20,
  sort_by: "reviewDate",
  sort_order: "desc",
};

export default function PerformanceReviewsPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const canReadPerformanceReviews = hasPermission("performance_reviews.read");
  const canReadEmployees = hasPermission("employees.read");
  const canReadUsers = hasPermission("users.read");

  const [deleteTarget, setDeleteTarget] = useState<PerformanceReview | null>(null);

  const deletePerformanceReview = useDeletePerformanceReview();

  const [params, setParams] = useState<PerformanceReviewQueryParams>( DEFAULT_PARAMS, ); 
  const reviews = usePerformanceReviews(
    params,
    canReadPerformanceReviews,
  );

  const employees = useEmployees(
    {
      page: 1,
      per_page: 100,
      status: "ACTIVE",
    },
    canReadPerformanceReviews &&
      canReadEmployees,
  );
  const data =
    reviews.data?.data ?? [];

  const meta =
    reviews.data?.meta;

  if (!canReadPerformanceReviews) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to view performance reviews.
        </p>
      </div>
    );
  }

  const isLoading =
    reviews.isLoading ||
    (canReadEmployees && employees.isLoading);

  const isError =
    reviews.isError ||
    (canReadEmployees && employees.isError);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Performance Reviews
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage employee performance reviews and evaluation results.
          </p>
        </div>

        {hasPermission("performance_reviews.create") && (
          <Button
            type="button"
            className="rounded-xl"
            onClick={() =>
              router.push("/performance-reviews/new")
            }
          >
            Create Review
          </Button>
        )}
      </div>

      <PerformanceReviewToolbar
        params={params}
        employees={employees.data?.data ?? []}
        onChange={setParams}
      />
  
      {/* Content */}
      {isLoading ? (
        <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            Unable to load performance reviews.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => {
              reviews.refetch();

              if (canReadEmployees) {
                employees.refetch();
              }
            }}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta?.total ?? 0}{" "}
              {meta?.total === 1
                ? "performance review"
                : "performance reviews"}
            </p>
          </div>

          <PerformanceReviewTable
            reviews={data}
            onView={(review) =>
              router.push(`/performance-reviews/${review.id}`)
            }
            onEdit={
              hasPermission("performance_reviews.update") &&
              canReadUsers
                ? (review) =>
                    router.push(
                      `/performance-reviews/${review.id}/edit`,
                    )
                : undefined
            }
            onDelete={
              hasPermission("performance_reviews.delete")
                ? (review) =>
                    setDeleteTarget(review)
                : undefined
            }
          />

          {meta && meta.total_pages > 0 && (
            <PerformanceReviewPagination
              page={meta.page}
              totalPages={meta.total_pages}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={(page: number) =>
                setParams((current) => ({
                  ...current,
                  page,
                }))
              }
            />
          )}

        </>
      )}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deletePerformanceReview.isPending
          ) {
            setDeleteTarget(null);
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
                {deleteTarget?.employee.name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                deletePerformanceReview.isPending
              }
            >
              Back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                deletePerformanceReview.isPending
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (!deleteTarget) {
                  return;
                }

                deletePerformanceReview.mutate(
                  deleteTarget.id,
                  {
                    onSuccess: () => {
                      setDeleteTarget(null);
                      reviews.refetch();
                    },
                  },
                );
              }}
            >
              {deletePerformanceReview.isPending
                ? "Deleting..."
                : "Delete Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}