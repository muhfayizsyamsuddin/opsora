"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import { getEmployees } from "@/services/employee.service";
import { createLeave } from "@/services/leave.service";

export default function NewLeavePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading: isLoadingEmployees } =
    useQuery({
      queryKey: ["employees", "leave-form"],
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
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!employeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Start date and end date are required");
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

      await createLeave({
        employeeId,
        startDate,
        endDate,
        reason: reason.trim(),
      });

      await queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success(
        "Leave request created successfully",
      );

      router.push("/leave");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to create leave request";

        toast.error(message);
      } else {
        toast.error(
          "Failed to create leave request",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/leave"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Leave
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          Create Leave Request
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new employee leave request.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
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
                disabled={
                  isLoadingEmployees ||
                  isSubmitting
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">
                  {isLoadingEmployees
                    ? "Loading Employees..."
                    : "Select Employee"}
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
                placeholder="Enter leave reason..."
                rows={5}
                disabled={isSubmitting}
                className="flex min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-xs text-muted-foreground">
                Minimum 5 characters.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Link href="/leave">
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
                  ? "Creating..."
                  : "Create Leave"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}