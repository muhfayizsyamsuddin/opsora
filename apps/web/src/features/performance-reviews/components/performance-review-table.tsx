"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  PerformanceReview,
} from "@/features/performance-reviews/types/performance-review";

type PerformanceReviewTableProps = {
  reviews: PerformanceReview[];
  onView: (
    review: PerformanceReview,
  ) => void;
  onEdit?: (
    review: PerformanceReview,
  ) => void;
  onDelete?: (
    review: PerformanceReview,
  ) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
    },
  ).format(new Date(value));
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

export function PerformanceReviewTable({
  reviews,
  onView,
  onEdit,
  onDelete,
}: PerformanceReviewTableProps) {
  if (reviews.length === 0) {
    return (
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h3 className="text-sm font-semibold">
            No performance reviews found
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try changing your filters or create a new performance review.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <th className="px-5 py-4">
                Employee
              </th>

              <th className="px-5 py-4">
                Reviewer
              </th>

              <th className="px-5 py-4">
                Period
              </th>

              <th className="px-5 py-4">
                Score
              </th>

              <th className="px-5 py-4">
                Review Date
              </th>

              <th className="px-5 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-b last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">
                    {review.employee.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.employee.employeeCode}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.employee.position}
                  </p>
                </td>

                <td className="px-5 py-4">
                  {review.reviewer ? (
                    <>
                      <p className="font-medium">
                        {review.reviewer.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {review.reviewer.email}
                      </p>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      {review.reviewerLegacy ?? "—"}
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  {review.reviewPeriod ?? "—"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getScoreStyle(
                      review.score,
                    )}`}
                  >
                    {review.score}
                  </span>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(
                    review.reviewDate,
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-lg"
                      aria-label={`View performance review for ${review.employee.name}`}
                      onClick={() => onView(review)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {onEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label={`Edit performance review for ${review.employee.name}`}
                        onClick={() => onEdit(review)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-lg text-destructive hover:text-destructive"
                        aria-label={`Delete performance review for ${review.employee.name}`}
                        onClick={() => onDelete(review)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}