"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getEmployeeById,
  updateEmployee,
} from "@/services/employee.service";

import { getDepartments } from "@/services/department.service";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    "ACTIVE" | "INACTIVE"
  >("ACTIVE");

  const {
    data: employee,
    isLoading: isLoadingEmployee,
    isError: isEmployeeError,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
  });

  const {
    data,
    isLoading: isLoadingDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      getDepartments({
        page: 1,
        limit: 100,
        sort: "name",
        order: "asc",
      }),
  });

  const departments = data?.data ?? [];

  useEffect(() => {
    if (!employee) {
      return;
    }

    setName(employee.name);
    setEmail(employee.email);
    setDepartmentId(employee.department.id);
    setStatus(employee.status);
    setPosition(employee.position);
    setSalary(String(employee.salary));

    setHireDate(
      new Date(employee.hireDate)
        .toISOString()
        .split("T")[0],
    );
  }, [employee]);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!departmentId) {
      toast.error("Please select a department");
      return;
    }

    if (!salary || Number(salary) <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    if (!hireDate) {
      toast.error("Please select a hire date");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateEmployee(id, {
        name,
        email,
        position,
        salary: Number(salary),
        hireDate,
        departmentId,
        status,
      });

      await queryClient.invalidateQueries({
        queryKey: ["employee", id],
      });

      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Employee updated successfully");

      router.push(`/employees/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "Failed to update employee";

        toast.error(message);
      } else {
        toast.error("Failed to update employee");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingEmployee) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading employee...
        </p>
      </div>
    );
  }

  if (isEmployeeError || !employee) {
    return (
      <div className="space-y-6">
        <Link href="/employees">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Employee not found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/employees/${id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employee
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">
          Edit Employee
        </h1>

        <p className="text-sm text-muted-foreground">
          Update employee information.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <Input
                  id="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="department"
                  className="text-sm font-medium"
                >
                  Department
                </label>

                <select
                  id="department"
                  value={departmentId}
                  onChange={(event) =>
                    setDepartmentId(event.target.value)
                  }
                  disabled={isLoadingDepartments}
                  required
                  className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">
                    {isLoadingDepartments
                      ? "Loading departments..."
                      : "Select department"}
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
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
                      event.target.value as "ACTIVE" | "INACTIVE",
                    )
                  }
                  required
                  className="flex h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="position"
                  className="text-sm font-medium"
                >
                  Position
                </label>

                <Input
                  id="position"
                  value={position}
                  onChange={(event) =>
                    setPosition(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="salary"
                  className="text-sm font-medium"
                >
                  Salary
                </label>

                <Input
                  id="salary"
                  type="number"
                  min="1"
                  value={salary}
                  onChange={(event) =>
                    setSalary(event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hireDate"
                  className="text-sm font-medium"
                >
                  Hire Date
                </label>

                <Input
                  id="hireDate"
                  type="date"
                  value={hireDate}
                  onChange={(event) =>
                    setHireDate(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Link href={`/employees/${id}`}>
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