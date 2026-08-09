"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getEmployees } from "@/services/employee.service";
import { createPerformanceReview } from "@/services/performance-review.service";

export default function NewPerformanceReviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [employeeId, setEmployeeId] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [score, setScore] = useState("");
  const [reviewDate, setReviewDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading: isLoadingEmployees,
  } = useQuery({
    queryKey: ["employees", "performance-review-form"],
    queryFn: () =>
      getEmployees({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

  const employees = data?.data ?? [];

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (!reviewer.trim()) {
      toast.error("Reviewer is required");
      return;
    }

    const scoreValue = Number(score);

    if (
      !score ||
      !Number.isInteger(scoreValue) ||
      scoreValue < 1 ||
      scoreValue > 100
    ) {
      toast.error("Score must be between 1 and 100");
      return;
    }

    if (!reviewDate) {
      toast.error("Please select a review date");
      return;
    }

    try {
      setIsSubmitting(true);

      await createPerformanceReview({
        employeeId,
        reviewer: reviewer.trim(),
        score: scoreValue,
        comments: comments.trim() || undefined,
        reviewDate,
      });

      await queryClient.invalidateQueries({
        queryKey: ["performance-reviews"],
      });

      toast.success(
        "Performance review created successfully",
      );

      router.push("/performance-review");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to create performance review";

        toast.error(message);
      } else {
        toast.error(
          "Failed to create performance review",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/performance-review">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Performance Reviews
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          Add Performance Review
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a performance review for an employee.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Performance Review Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="employee"
                  className="text-sm font-medium"
                >
                  Employee
                </label>

                <select
                  id="employee"
                  value={employeeId}
                  onChange={(event) =>
                    setEmployeeId(event.target.value)
                  }
                  disabled={isLoadingEmployees}
                  required
                  className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">
                    {isLoadingEmployees
                      ? "Loading employees..."
                      : "Select employee"}
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="reviewer"
                  className="text-sm font-medium"
                >
                  Reviewer
                </label>

                <Input
                  id="reviewer"
                  value={reviewer}
                  onChange={(event) =>
                    setReviewer(event.target.value)
                  }
                  placeholder="Enter reviewer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="score"
                  className="text-sm font-medium"
                >
                  Score
                </label>

                <Input
                  id="score"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={score}
                  onChange={(event) =>
                    setScore(event.target.value)
                  }
                  placeholder="1 - 100"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  Enter a score from 1 to 100.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="reviewDate"
                  className="text-sm font-medium"
                >
                  Review Date
                </label>

                <Input
                  id="reviewDate"
                  type="date"
                  value={reviewDate}
                  onChange={(event) =>
                    setReviewDate(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="comments"
                className="text-sm font-medium"
              >
                Comments
              </label>

              <textarea
                id="comments"
                value={comments}
                onChange={(event) =>
                  setComments(event.target.value)
                }
                placeholder="Write performance review comments..."
                rows={5}
                className="flex w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link href="/performance-review">
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}