"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CircleUser,
  CalendarDays,
  UserRound,
  Award,
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
  getPerformanceReviewById,
  deletePerformanceReview,
} from "@/services/performance-review.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PerformanceReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = params.id;

  const {
    data: review,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["performance-review", id],
    queryFn: () => getPerformanceReviewById(id),
    enabled: Boolean(id),
  });

  async function handleDelete() {
    try {
        setIsDeleting(true);

        await deletePerformanceReview(id);

        await queryClient.invalidateQueries({
        queryKey: ["performance-reviews"],
        });

        await queryClient.invalidateQueries({
        queryKey: ["performance-review", id],
        });

        setIsDeleteOpen(false);

        toast.success(
        "Performance review deleted successfully",
        );

        router.push("/performance-review");
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ??
            "Failed to delete performance review";

        toast.error(message);
        } else {
        toast.error(
            "Failed to delete performance review",
        );
        }
    } finally {
        setIsDeleting(false);
    }
  }

  if (isLoading) {
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
        <Link href="/performance-review">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Performance Reviews
          </Button>
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Performance Review Detail
            </h1>

            <p className="text-sm text-muted-foreground">
              View employee performance review information.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/performance-review/${review.id}/edit`}
            >
              <Button variant="outline">
                Edit
              </Button>
            </Link>

            <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <CircleUser className="h-10 w-10 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              {review.employee.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {review.employee.email}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Review Information
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
                  {review.employee.department.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Reviewer
                </p>

                <p className="text-sm font-medium">
                  {review.reviewer}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Review Date
                </p>

                <p className="text-sm font-medium">
                  {new Date(
                    review.reviewDate,
                  ).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Score
                </p>

                <p className="text-xl font-semibold">
                  {review.score}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    / 100
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Comments
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-6">
            {review.comments || "No comments provided."}
          </p>
        </CardContent>
      </Card>
      <Dialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      >
        <DialogContent>
            <DialogHeader>
            <DialogTitle>
                Delete Performance Review
            </DialogTitle>

            <DialogDescription>
                Are you sure you want to delete this
                performance review? This action cannot be
                undone.
            </DialogDescription>
            </DialogHeader>

            <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
            >
                Cancel
            </Button>

            <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting
                ? "Deleting..."
                : "Delete"}
            </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}