"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PerformanceReviewForm } from "@/features/performance-reviews/components/performance-review-form";
import { usePermissions } from "@/hooks/use-permissions";

export default function NewPerformanceReviewPage() {
  const router = useRouter();

  const { hasPermission } = usePermissions();
  const canCreatePerformanceReview = hasPermission("performance_reviews.create");
  const canReadEmployees = hasPermission("employees.read");
  const canReadUsers = hasPermission("users.read");

  if (
    !canCreatePerformanceReview ||
    !canReadEmployees ||
    !canReadUsers
  ) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            People Operations
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Create Performance Review
          </h1>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="font-medium">
            You do not have permission to create performance reviews.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please contact an administrator if you need access.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => router.push("/performance-reviews")}
          >
            Back to Performance Reviews
          </Button>
        </div>
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
          Create Performance Review
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new performance evaluation for an employee.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <PerformanceReviewForm />
      </div>
    </div>
  );
}