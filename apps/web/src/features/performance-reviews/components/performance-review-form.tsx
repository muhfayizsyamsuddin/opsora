"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/use-permissions";
import { useEmployees } from "@/features/employees/queries/use-employees";
import { useUsers } from "@/features/users/queries/use-users";

import { useCreatePerformanceReview } from "@/features/performance-reviews/mutations/use-create-performance-review";
import { useUpdatePerformanceReview } from "@/features/performance-reviews/mutations/use-update-performance-review";
import { usePerformanceReview } from "@/features/performance-reviews/queries/use-performance-review";

import {
  performanceReviewFormSchema,
  type PerformanceReviewFormInput,
  type PerformanceReviewFormValues,
} from "@/features/performance-reviews/schemas/performance-review-form.schema";

type PerformanceReviewFormProps = {
  reviewId?: string;
};

export function PerformanceReviewForm({
  reviewId,
}: PerformanceReviewFormProps) {
  const router = useRouter();
  const isEdit = Boolean(reviewId);

  const { hasPermission } = usePermissions();
  const canReadPerformanceReviews = hasPermission("performance_reviews.read");
  const canReadEmployees = hasPermission("employees.read");
  const canReadUsers = hasPermission("users.read");

  const createReview =
    useCreatePerformanceReview();

  const updateReview =
    useUpdatePerformanceReview();

  const review = usePerformanceReview(
    reviewId ?? "",
    isEdit && canReadPerformanceReviews,
  );

  const employees = useEmployees(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
      status: "ACTIVE",
    },
    !isEdit && canReadEmployees,
  );

  const users = useUsers(
    {
      page: 1,
      per_page: 100,
      sort_by: "name",
      sort_order: "asc",
    },
    canReadUsers,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    PerformanceReviewFormInput,
    unknown,
    PerformanceReviewFormValues
  >({
    resolver: zodResolver(
      performanceReviewFormSchema,
    ),
    defaultValues: {
      employeeId: "",
      reviewerId: "",
      reviewPeriod: "",
      score: undefined,
      comments: "",
    },
  });

  useEffect(() => {
    if (!isEdit || !review.data) {
      return;
    }

    reset({
      employeeId: review.data.employeeId,
      reviewerId:
        review.data.reviewerId ?? "",
      reviewPeriod:
        review.data.reviewPeriod ?? "",
      score: review.data.score,
      comments:
        review.data.comments ?? "",
    });
  }, [
    isEdit,
    review.data,
    reset,
  ]);

  const onSubmit = (
    values: PerformanceReviewFormValues,
  ) => {
    if (isEdit && reviewId) {
      updateReview.mutate(
        {
          id: reviewId,
          data: {
            reviewer_id:
              values.reviewerId,
            review_period:
              values.reviewPeriod,
            score: values.score,
            comments:
              values.comments ||
              undefined,
          },
        },
        {
          onSuccess: () => {
            router.push(
              `/performance-reviews/${reviewId}`,
            );
          },
        },
      );

      return;
    }

    createReview.mutate(
      {
        employee_id: values.employeeId,
        reviewer_id: values.reviewerId,
        review_period:
          values.reviewPeriod,
        score: values.score,
        comments:
          values.comments || undefined,
      },
      {
        onSuccess: () => {
          router.push(
            "/performance-reviews",
          );
        },
      },
    );
  };

  const employeeList =
    employees.data?.data ?? [];

  const userList =
    users.data?.data ?? [];

  const isPending =
    createReview.isPending ||
    updateReview.isPending;

  if (isEdit && review.isLoading) {
    return (
      <div className="min-h-72 animate-pulse rounded-2xl border bg-muted/30" />
    );
  }

  if (isEdit && review.error) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <p className="font-medium">
          Unable to load performance review.
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => review.refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Employee
          </label>

           {isEdit ? (
            <>
              <Input
                value={
                  review.data
                    ? `${review.data.employee.name} — ${review.data.employee.employeeCode}`
                    : ""
                }
                disabled
                className="h-10 rounded-xl"
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Employee cannot be changed when editing a review.
              </p>
            </>
          ) : (
            <>
              <select
                {...register("employeeId")}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none"
              >
                <option value="">
                  Select employee
                </option>

                {employeeList.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} — {employee.employeeCode}
                  </option>
                ))}
              </select>

              {errors.employeeId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.employeeId.message}
                </p>
              )}
            </>
          )}

          {errors.employeeId && (
            <p className="mt-1 text-xs text-destructive">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reviewer
          </label>

          <select
            {...register("reviewerId")}
            className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none"
          >
            <option value="">
              Select reviewer
            </option>

            {userList.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name} — {user.email}
              </option>
            ))}
          </select>

          {errors.reviewerId && (
            <p className="mt-1 text-xs text-destructive">
              {errors.reviewerId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Review Period
          </label>

          <Input
            {...register("reviewPeriod")}
            placeholder="e.g. Q1 2026"
            className="h-10 rounded-xl"
          />

          {errors.reviewPeriod && (
            <p className="mt-1 text-xs text-destructive">
              {errors.reviewPeriod.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Performance Score
          </label>

          <Input
            type="number"
            min={1}
            max={100}
            {...register("score", {
              valueAsNumber: true,
            })}
            placeholder="1 - 100"
            className="h-10 rounded-xl"
          />

          {errors.score && (
            <p className="mt-1 text-xs text-destructive">
              {errors.score.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Review Notes
        </label>

        <textarea
          {...register("comments")}
          rows={5}
          placeholder="Write review notes..."
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none"
        />

        {errors.comments && (
          <p className="mt-1 text-xs text-destructive">
            {errors.comments.message}
          </p>
        )}
      </div>

      {(createReview.error ||
        updateReview.error) && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {isEdit
            ? "Unable to update performance review. Please try again."
            : "Unable to create performance review. Please try again."}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() =>
            router.push(
              isEdit && reviewId
                ? `/performance-reviews/${reviewId}`
                : "/performance-reviews",
            )
          }
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : isEdit
              ? "Update Review"
              : "Save Review"}
        </Button>
      </div>
    </form>
  );
}