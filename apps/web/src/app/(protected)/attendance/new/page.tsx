"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getEmployees } from "@/services/employee.service";
import {
  createAttendance,
  type AttendanceStatus,
} from "@/services/attendance.service";

export default function NewAttendancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [employeeId, setEmployeeId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [status, setStatus] =
    useState<AttendanceStatus>("PRESENT");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const {
    data,
    isLoading: isLoadingEmployees,
  } = useQuery({
    queryKey: ["employees", "attendance-create"],
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

    if (!checkIn) {
      toast.error("Please select check in time");
      return;
    }

    try {
      setIsSubmitting(true);

      await createAttendance({
        employeeId,
        checkIn: new Date(checkIn).toISOString(),
        status,
      });

      await queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      toast.success(
        "Attendance created successfully",
      );

      router.push("/attendance");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to create attendance";

        toast.error(message);
      } else {
        toast.error(
          "Failed to create attendance",
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
          href="/attendance"
          className="inline-flex items-center text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">
          Add Attendance
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new attendance record.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
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
                    setEmployeeId(
                      event.target.value,
                    )
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
                      {employee.name} —{" "}
                      {employee.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="checkIn"
                  className="text-sm font-medium"
                >
                  Check In
                </label>

                <Input
                  id="checkIn"
                  type="datetime-local"
                  value={checkIn}
                  onChange={(event) =>
                    setCheckIn(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as AttendanceStatus,
                    )
                  }
                  className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="PRESENT">
                    Present
                  </option>
                  <option value="LATE">
                    Late
                  </option>
                  <option value="ABSENT">
                    Absent
                  </option>
                  <option value="LEAVE">
                    Leave
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link href="/attendance">
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
                  : "Create Attendance"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}