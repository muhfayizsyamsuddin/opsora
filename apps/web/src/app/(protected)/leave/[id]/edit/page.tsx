"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getLeaveById,
  updateLeave,
} from "@/services/leave.service";

export default function EditLeavePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] =
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

  useEffect(() => {
    if (!leave) return;

    setStartDate(
      new Date(leave.startDate)
        .toISOString()
        .slice(0, 10),
    );

    setEndDate(
      new Date(leave.endDate)
        .toISOString()
        .slice(0, 10),
    );

    setReason(leave.reason);
  }, [leave]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!startDate || !endDate) {
      toast.error(
        "Start date and end date are required",
      );
      return;
    }

    if (endDate < startDate) {
      toast.error(
        "End date cannot be earlier than start date",
      );
      return;
    }

    if (reason.trim().length < 5) {
      toast.error(
        "Reason must be at least 5 characters",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await updateLeave(id, {
        startDate,
        endDate,
        reason: reason.trim(),
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["leave", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["leaves"],
        }),
      ]);

      toast.success(
        "Leave updated successfully",
      );

      router.push(`/leave/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to update leave";

        toast.error(message);
      } else {
        toast.error("Failed to update leave");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href={`/leave/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Leave
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
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Leave
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

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/leave/${id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Leave Detail
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          Edit Leave
        </h1>

        <p className="text-sm text-muted-foreground">
          Update leave request information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {leave.employee.name}
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            {leave.employee.department.name}
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium"
                >
                  Start Date
                </label>

                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium"
                >
                  End Date
                </label>

                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="text-sm font-medium"
              >
                Reason
              </label>

              <textarea
                id="reason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                rows={5}
                disabled={isSubmitting}
                className="flex min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Link href={`/leave/${id}`}>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
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