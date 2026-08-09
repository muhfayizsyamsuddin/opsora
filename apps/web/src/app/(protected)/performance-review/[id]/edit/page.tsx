"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

import {
  getPerformanceReviewById,
  updatePerformanceReview,
} from "@/services/performance-review.service";

export default function EditPerformanceReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const id = params.id;

  const [reviewer, setReviewer] = useState("");
  const [score, setScore] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: review,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["performance-review", id],
    queryFn: () => getPerformanceReviewById(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!review) {
      return;
    }

    setReviewer(review.reviewer);
    setScore(String(review.score));
    setComments(review.comments ?? "");

    setReviewDate(
      new Date(review.reviewDate)
        .toISOString()
        .split("T")[0],
    );
  }, [review]);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

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

      await updatePerformanceReview(id, {
        reviewer: reviewer.trim(),
        score: scoreValue,
        comments: comments.trim() || undefined,
        reviewDate,
      });

      await queryClient.invalidateQueries({
        queryKey: ["performance-review", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["performance-reviews"],
      });

      toast.success(
        "Performance review updated successfully",
      );

      router.push(`/performance-review/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to update performance review";

        toast.error(message);
      } else {
        toast.error(
          "Failed to update performance review",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href={`/performance-review/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Review
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading performance review...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !review) {
    return (
      <div className="space-y-6">
        <Link href="/performance-review">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Performance Reviews
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Performance review not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/performance-review/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Review
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          Edit Performance Review
        </h1>

        <p className="text-sm text-muted-foreground">
          Update performance review information.
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
            <div className="rounded-md border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Employee
              </p>

              <p className="mt-1 text-sm font-medium">
                {review.employee.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {review.employee.department.name}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
              <Link href={`/performance-review/${id}`}>
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
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}