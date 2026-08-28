"use client";

import { use } from "react";

import { PerformanceReviewForm } from "@/features/performance-reviews/components/performance-review-form";
import { usePermissions } from "@/hooks/use-permissions";

type EditPerformanceReviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditPerformanceReviewPage({
  params,
}: EditPerformanceReviewPageProps) {
  const { id } = use(params);

  const { hasPermission } =
    usePermissions();

  const canUpdatePerformanceReview = hasPermission("performance_reviews.update");

  if (!canUpdatePerformanceReview) {
    return (
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-medium">
          You do not have permission to edit performance reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          People Operations
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit Performance Review
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update the employee performance review
          and evaluation results.
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <PerformanceReviewForm
          reviewId={id}
        />
      </section>
    </div>
  );
}