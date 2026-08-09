"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { getPerformanceReviews } from "@/services/performance-review.service";

export default function PerformanceReviewPage() {
  const [search, setSearch] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [scoreRange, setScoreRange] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, reviewer, scoreRange]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "performance-reviews",
      {
        page,
        search: debouncedSearch,
        reviewer,
        scoreRange,
      },
    ],
    queryFn: () =>
      getPerformanceReviews({
        page,
        limit: pageSize,
        search:
          debouncedSearch || undefined,
        reviewer:
          reviewer || undefined,
        scoreMin:
            scoreRange === "90-100"
                ? 90
                : scoreRange === "80-89"
                ? 80
                : scoreRange === "70-79"
                    ? 70
                    : scoreRange === "60-69"
                    ? 60
                    : scoreRange === "0-59"
                        ? 0
                        : undefined,

            scoreMax:
            scoreRange === "90-100"
                ? 100
                : scoreRange === "80-89"
                ? 89
                : scoreRange === "70-79"
                    ? 79
                    : scoreRange === "60-69"
                    ? 69
                    : scoreRange === "0-59"
                        ? 59
                        : undefined,
                    sort: "reviewDate",
                    order: "desc",
                }),
      placeholderData: (previousData) => previousData,
  });

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  const total = meta?.total ?? 0;
  const totalPages =
    meta?.totalPages ?? 1;

  const startIndex =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endIndex = Math.min(
    page * pageSize,
    total,
  );

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Performance Review
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee performance reviews.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Loading performance reviews...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Performance Review
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee performance reviews.
          </p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-destructive">
              Failed to load performance reviews.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Performance Review
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage employee performance reviews.
          </p>
        </div>

        <Link
          href="/performance-review/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
        >
          Add Performance Review
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employees..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <input
              value={reviewer}
              onChange={(event) =>
                setReviewer(event.target.value)
              }
              placeholder="Search reviewer..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <select
                value={scoreRange}
                onChange={(event) =>
                    setScoreRange(event.target.value)
                }
                className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                <option value="">All Scores</option>
                <option value="90-100">
                    90–100 — Excellent
                </option>
                <option value="80-89">
                    80–89 — Very Good
                </option>
                <option value="70-79">
                    70–79 — Good
                </option>
                <option value="60-69">
                    60–69 — Needs Improvement
                </option>
                <option value="0-59">
                    0–59 — Poor
                </option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-6 py-4 font-medium">
                    Employee
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Reviewer
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Score
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Review Date
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Comments
                  </th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/performance-review/${review.id}`}
                        className="hover:underline"
                      >
                        {review.employee.name}
                      </Link>

                      <p className="text-xs text-muted-foreground">
                        {review.employee.department.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {review.reviewer}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {review.score}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(
                        review.reviewDate,
                      ).toLocaleDateString(
                        "id-ID",
                      )}
                    </td>

                    <td className="max-w-xs px-6 py-4 text-sm">
                      <p className="truncate">
                        {review.comments || "-"}
                      </p>
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      No performance reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 0 && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex}–{endIndex} of{" "}
                {total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage(
                      (current) =>
                        current - 1,
                    )
                  }
                  className="rounded-md border px-3 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-2 text-sm">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1,
                    )
                  }
                  className="rounded-md border px-3 py-2 text-sm disabled:pointer-events-none disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}